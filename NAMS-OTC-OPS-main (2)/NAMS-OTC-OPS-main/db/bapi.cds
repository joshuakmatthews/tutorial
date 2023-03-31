namespace bapi;

type return {
    TYPE       : String(1);
    ID         : String(20);
    NUMBER     : String(3);
    MESSAGE    : String(220);
    LOG_NO     : String(20);
    LOG_MSG_NO : String(6);
    MESSAGE_V1 : String(50);
    MESSAGE_V2 : String(50);
    MESSAGE_V3 : String(50);
    MESSAGE_V4 : String(50);
    PARAMETER  : String(32);
    ROW        : Integer;
    FIELD      : String(30);
    SYSTEM     : String(10);
}

type returns : array of return;
