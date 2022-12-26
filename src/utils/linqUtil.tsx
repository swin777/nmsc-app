import Enumerable from "linq";

const _Enumerable:any = Enumerable

export const _join_ = (leftData:any, rightData:any, leftKey:string, rightKey:string) => 
_Enumerable.from(leftData)
  .join(
    rightData,
    (pk:any) => pk[leftKey],
    (fk:any) => fk[rightKey],
    (left:any, right:any) => ({ ...left, ...right })
  )
  .toArray();

  export const _leftJoin_ = (leftData:any, rightData:any, leftKey:string, rightKey:string) => 
  _Enumerable.from(leftData)
  .leftJoin(
    rightData,
    (pk:any) => pk[leftKey],
    (fk:any) => fk[rightKey],
    (left:any, right:any) => ({ ...left, ...right })
  )
  .toArray();

  const RightJoin = (source:any, inner:any, pk:any, fk:any, result:any) =>
  _Enumerable.from(inner)
    .groupJoin(
      _Enumerable.from(source),
      (i:any) => fk(i),
      (s:any) => pk(s),
      (right:any, left:any) => ({ right, left })
    )
    .selectMany(
      (m:any) => m.left.defaultIfEmpty(),
      (prev:any, left:any) => result(left, prev.right)
    );


  _Enumerable.prototype.rightJoin = function (inner:any, pk:any, fk:any, result:any) {
      return RightJoin(this, inner, pk, fk, result);
    };

  export const _rightJoin_ = (leftData:any, rightData:any, leftKey:string, rightKey:string) => 
  _Enumerable.from(leftData)
     .rightJoin(_Enumerable.from(rightData),
          (pk:any) => pk.id,
          (fk:any) => fk.orderId,
          (left:any, right:any) => ({ ...left, ...right })
  ).toArray();