import Card from "../card/Card"
import { listData } from "../../lib/dummydata"
import { Post } from '../../lib/types'

function List(){
  return (
    <div className='flex flex-col gap-[50px]'>
      {listData.map(item=>(
        <Card key={item.id} item={item as unknown as Post}/>
      ))}
    </div>
  )
}

export default List
