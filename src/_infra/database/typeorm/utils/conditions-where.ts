import { FindOptionsWhere, ILike } from 'typeorm'

export function addAndCondition<T>(
  whereClause: FindOptionsWhere<T>[],
  condition: FindOptionsWhere<T>,
) {
  if (whereClause.length === 0) {
    whereClause.push(condition)
  } else {
    for (const obj of whereClause) {
      Object.assign(obj, condition)
    }
  }
}

export function addOrCondition<T>(
  whereClause: FindOptionsWhere<T>[],
  condition: FindOptionsWhere<T>,
) {
  whereClause.push(condition)
}

export function addMultipleColumnsSearch<T>(
  whereClause: FindOptionsWhere<T>[],
  columns: Array<keyof FindOptionsWhere<T>>,
  search: string,
) {
  if (whereClause.length === 0) {
    for (const column of columns) {
      const condition = {
        [column]: ILike(`%${search}%`),
      } as FindOptionsWhere<T>
      whereClause.push(condition)
    }
  } else {
    const baseCondition = { ...whereClause[0] }
    whereClause.length = 0

    for (const column of columns) {
      const newCondition = {
        ...baseCondition,
        [column]: ILike(`%${search}%`),
      }
      whereClause.push(newCondition)
    }
  }
}
