export interface IUser {
    _id: string;  // Add the _id field if it's part of the user
    email: string;
    password: string;
    // any other fields in the user schema
  }
  
  export interface IUserWithoutPassword extends Omit<IUser, 'password'> {}
  