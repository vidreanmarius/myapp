import axios from "axios"
import { GET_USERS } from "../Utils/UrlConstants"


export default async () => {

    try {
        const response = await axios.get(GET_USERS)
        return response.data
      } 
      catch (error) {
         return {
            isError:true
         }
      }
}
