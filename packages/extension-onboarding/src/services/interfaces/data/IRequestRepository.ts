export interface IRequestRepository{
    googleObjecToBusinessPII: (auth_token:string,googleId:string) => any
}