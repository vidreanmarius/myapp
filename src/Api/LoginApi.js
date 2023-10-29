import axios from "axios"
import { LOGIN_URL } from "../Utils/UrlConstants"
export default async (email, password) => {

    try {
        const response = await axios.post(LOGIN_URL,{
            
                username: email,
                password: password,
                
        })
        return response.data
      } 
      catch (error) {
         return {
            isError:true
         }
      }
}