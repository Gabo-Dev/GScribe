 
/**
 *  data type to let TS use it to build contracts.
 *  email and alias are optional (? check) 
 * */
export interface User{
    id: string; 
    email?: string | null;
    alias?: string | null;
}