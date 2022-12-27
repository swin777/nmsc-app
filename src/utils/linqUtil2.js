

import Enumerable from "linq";

export const ttt = ''

const _Enumerable = Enumerable;
export const _join_ = (leftData, rightData, leftKey, rightKey) => _Enumerable.from(leftData)
    .join(rightData, (pk) => pk[leftKey], (fk) => fk[rightKey], (left, right) => (Object.assign(Object.assign({}, left), right)))
    .toArray();
export const _leftJoin_ = (leftData, rightData, leftKey, rightKey) => _Enumerable.from(leftData)
    .leftJoin(rightData, (pk) => pk[leftKey], (fk) => fk[rightKey], (left, right) => (Object.assign(Object.assign({}, left), right)))
    .toArray();
const RightJoin = (source, inner, pk, fk, result) => _Enumerable.from(inner)
    .groupJoin(_Enumerable.from(source), (i) => fk(i), (s) => pk(s), (right, left) => ({ right, left }))
    .selectMany((m) => m.left.defaultIfEmpty(), (prev, left) => result(left, prev.right));
_Enumerable.prototype.rightJoin = function (inner, pk, fk, result) {
    return RightJoin(this, inner, pk, fk, result);
};
export const _rightJoin_ = (leftData, rightData, leftKey, rightKey) => _Enumerable.from(leftData)
    .rightJoin(_Enumerable.from(rightData), (pk) => pk.id, (fk) => fk.orderId, (left, right) => (Object.assign(Object.assign({}, left), right))).toArray();

    
addEventListener('message', async function (e) {
  const type = e.data.type;
  console.log(e.data.rightData)
  if(type==='_join_'){
    postMessage(_join_(e.data.leftData, e.data.rightData, e.data.leftKey, e.data.rightKey));
  }else if(type==='_leftJoin_'){
    postMessage(_leftJoin_(e.data.leftData, e.data.rightData, e.data.leftKey, e.data.rightKey));
  }else if(type==='_rightJoin_'){
    postMessage(_rightJoin_(e.data.leftData, e.data.rightData, e.data.leftKey, e.data.rightKey));
  }
});