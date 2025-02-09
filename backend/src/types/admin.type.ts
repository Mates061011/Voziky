export interface IUser {
    _id: string;
    email: string;
    password: string;
}
  
export interface IUserWithoutPassword extends Omit<IUser, 'password'> {}
  