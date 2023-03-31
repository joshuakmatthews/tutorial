service JobsService @(requires: ['Admin', 'job-scheduler', 'system-user']) {
    action takeSnapshot(division : String(2)) returns Boolean;
}
