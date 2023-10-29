import axios from "axios"
import { REGISTER_URL } from "../Utils/UrlConstants"
export default async (email, password, role) => {

    try {
        const response = await axios.post(REGISTER_URL,{
            
                username: email,
                password: password,
                role: role
                
        })
        return response.data
      } 
      catch (error) {
         return {
            isError:true
         }
      }
}