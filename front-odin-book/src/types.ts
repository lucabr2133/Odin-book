
export enum errorsUsername{
  USER_MISSING='user missing',
  USER_MINLENGHT='user min lenght',  
}
export enum passwordErrors{
  PASSWORD_MISSING='password missing',
  PASSWORD_MINLENGHT='password  min  lenght',
  PASSWORD_INCORRECT='password incorrect'
}
export enum errorMesagges{
  USER_ISREQUIRED='user is required',
  USER_MINLENGHT='user min lenght is 4 characters',
  PASSWORD_ISREQUIRED='password is required',
  PASSWORD_MINLENGHT='password must have  a min of 8 characters',
  PASSWORD_INCORRECT='password or user dont match '
}
export type SignupError = '' | errorsUsername | passwordErrors

// types/User.ts
export interface User {
  id:           string       
  username:     string        
  password:     string
  description:  string         
  profileImg:   string        
  create_at:   string 
  githubId?: string
}
   export type data={
    message:string,
    user:User
  }
  export interface Comments {
      id:          string       
  post_id:     string
  user_id:     string
  content:     string
  create_at:   Date     
  }
  export interface Publications { 
      id:        string 
  user_id:   string
  content:   string
  create_at: Date  
  image_url: string
  }
  export interface Following {
      id:           string   
  follower_id:  string
  following_id: string
  create_at:    Date
  }
  export interface Likes{
      id :        string  
  post_id?:    string
  user_id:    string
  comment_id?: string
  }
  export interface Messages{
  id:          string 
  sender_id:   string
  receptor_id: string
  content:     string
  create_at:   Date
  }

  export interface params{
    username:string
  }
