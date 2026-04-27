import './list.scss'
import Card from "../card/Card"
import { listData } from "../../lib/dummydata"
import { Post } from '../../lib/types'

function List(){
  return (
    <div className='list'>
      {listData.map(item=>(
        <Card key={item.id} item={item as unknown as Post}/>
      ))}
    </div>
  )
}

export default List
