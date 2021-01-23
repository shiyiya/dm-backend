import jwt from 'jsonwebtoken'

export const sign = (payload: string) =>
  jwt.sign({ payload }, process.env.JWT_SECRET || 'snydxhh', {
    expiresIn: '7d',
  })

export const verify = (token: string): { [key: string]: any } | null => {
  try {
    //@ts-ignore
    const t = jwt.verify(token, process.env.JWT_SECRET || 'snydxhh') as any
    return t
  } catch (err) {
    return null
  }
}
