
export interface IUser {
    _id?        : string;
    firstName   : string;
    lastName    : string;
    email       : string;
    password    : string;
    phone       : string;
    images?     : string[];
    bornedAt    : string;
    role        : string;
    coments     : string;
    privateComents : string;
    createdAt?  : string;
    updatedAt?  : string;
}