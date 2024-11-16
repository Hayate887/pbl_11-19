import { Button } from '@chakra-ui/react';
import axios from 'axios';


export default function App() {

    async function getItem() {
        try {
          const url = "http://localhost:8000/users";
          const res = await axios.get(url);
          console.log(res.data) // response data
          console.log(res.status) // status code
        } catch (err) {
            console.error(err);
        }
      }

    return(
        <Button onClick={getItem}>ボタン</Button>
    )
}


