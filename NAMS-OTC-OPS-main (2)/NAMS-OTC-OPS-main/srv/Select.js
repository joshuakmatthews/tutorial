class Select {
    constructor(SELECT) {
        this.SELECT = SELECT;
        this.includesAllColumns = true; // Override to false if individual columns are specified (below)
        this.expands = {};
        this.tempColumns = [];

        if (this.SELECT?.columns && Array.isArray(this.SELECT.columns)) {
            for (const column of this.SELECT.columns) {
                const { ref, expand } = column;
                if (expand) {
                    this.expands[ref[0]] = new Select({columns: expand});
                } else if (ref) {
                    this.includesAllColumns = false; // Individual columns are specified: override to false
                } else {
                    // Must be column = '*' which explicitly includes all columns as a group
                }
            }
        }
    }

    includesColumn(name) {
        return this.includesAllColumns || this.SELECT.columns.some(({ref, as}) => ((ref && ref[0] === name) || as === name));
    }

    addColumn(name) {
        if (!this.includesColumn(name)) this.SELECT.columns.push({ref: [name]});
    }

    addTempColumn(name) {
        if (!this.includesColumn(name)) {
            const tempColumn = { ref: [name] };
            this.SELECT.columns.push(tempColumn);
            this.tempColumns.push(tempColumn);
        }
    }

    removeTempColumnsAndExpands(cascade = true) {
        for (const tempColumn of this.tempColumns) {
            const tempIndex = this.SELECT.columns.findIndex(column => column === tempColumn);
            if (tempIndex > -1) {
                const { ref, expand } = this.SELECT.columns.splice(tempIndex, 1);
                if (expand) delete this.expands[ref[0]];
            }
        }
        if (cascade) for (const expand of Object.values(this.expands)) expand.removeTempColumnsAndExpands(cascade);
    }

    removeColumn(name) {
        if (this.includesAllColumns) throw new Error('Cannot remove a column when all columns are included');
        const columnIndex = this.SELECT.columns.findIndex(({ref}) => ref[0] === name);
        return columnIndex > -1
            ? this.SELECT.columns.splice(columnIndex, 1)
            : null;
    }

    getExpandIndex(name) {
        return (this.SELECT.columns && Array.isArray(this.SELECT.columns))
            ? this.SELECT.columns.findIndex(({ expand, ref }) => expand && ref[0] === name)
            : -1;
    }

    removeExpand(name) {
        const expandIndex = this.getExpandIndex(name);
        if (expandIndex > -1) {
            delete this.expands[name];
            return this.SELECT.columns.splice(expandIndex, 1);
        } else {
            return null;
        }
    }

    addTempExpand(name, expand = ['*']) {
        if (this.getExpandIndex(name) === -1) {
            this.expands[name] = new Select({ columns: expand });
            const tempColumn = { ref: [name], expand: expand };
            if (!this.SELECT.columns) this.SELECT.columns = ['*'];
            this.SELECT.columns.push(tempColumn);
            this.tempColumns.push(tempColumn);
        }
    }

}

module.exports = Select;