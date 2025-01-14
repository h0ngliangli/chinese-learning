import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

const checkin_db = new Low(new JSONFile('db/checkin.json'), { checkin: [] })
checkin_db.read()

export async function checkin() {
  checkin_db.data.checkin = checkin_db.data.checkin || []
  const last_checkin = checkin_db.data.checkin[checkin_db.data.checkin.length - 1]
  if (last_checkin === new Date().toLocaleDateString()) {
    return
  }
  checkin_db.data.checkin.push(new Date().toLocaleDateString())
  checkin_db.write()
}

export default {
  checkin,
}
