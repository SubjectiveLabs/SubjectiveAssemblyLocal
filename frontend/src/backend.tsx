import { SHA256 } from "crypto-js";
import { createContext } from "react";
import { encrypt } from "utils/hash";

export type Day = BellTime[];
export type BellTime = {
  id: string,
  name: string,
  hour: number,
  minute: number,
  location?: string,
}
export type Link = {
  id: string,
  title: string,
  destination: string,
  icon: string,
}
export type School = {
  name: string,
  bell_times: Day[],
  links: Link[],
}

export type Agent = {
  getSchool: () => Promise<School>,
  putSchool: (school: School, password: string | null) => Promise<void>,
  getPassword: (password: string) => Promise<[boolean, boolean]>,
  putPassword: (previous: string, next: string | null) => Promise<void>,
  getThanks: () => Promise<number>,
}

export const Agent = function (this: Agent, url: string) {
  this.getSchool = async () => {
    const response = await fetch(`${url}/school`)
    if (!response.ok)
      throw new Error()
    const school = await response.json()
    return school as School
  }
  this.putSchool = async (school, password: string | null) => {
    if (!password) return
    if (!(await fetch(`${url}/school`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Assembly-Password': SHA256(password).toString(),
      },
      body: JSON.stringify(school),
    })).ok)
      throw new Error()
  }
  this.getPassword = async password => {
    const response = await fetch(`${url}/password`, {
      headers: {
        'X-Assembly-Password': SHA256(password).toString(),
      }
    })
    const text = await response.text()
    const exists = text[0] == "1",
      correct = text[1] == "1"
    return [exists, correct]
  }
  this.putPassword = async (previous, next: string | null) => {
    if (!(next && previous)) throw new Error()
    if (!(await fetch(`${url}/password`, {
      method: 'PUT',
      headers: {
        'X-Assembly-Password': SHA256(previous).toString(),
      },
      body: (await encrypt(next))
    })).ok)
      throw new Error()
  }
  this.getThanks = async () => {
    const response = await fetch(`${url}/thanks`)
    if (!response.ok)
      throw new Error()
    return parseInt(await response.text())
  }
} as unknown as { new(url: string): Agent }

export const AgentContext = createContext<Agent>({} as Agent)
