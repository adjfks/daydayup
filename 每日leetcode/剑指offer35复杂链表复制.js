/**
 * // Definition for a Node.
 * function Node(val, next, random) {
 *    this.val = val;
 *    this.next = next;
 *    this.random = random;
 * };
 */

/**
 * @param {Node} head
 * @return {Node}
 * 思路：2次遍历原链表
 第一次遍历先用哈希表存储原节点与新节点的映射，
 第二次遍历通过哈希表查next和random的指向节点
 */
 var copyRandomList = function(head) {
  if(!head) return head
  const map = new Map()
  let cur = head
  // 第一次遍历，建立映射关系
  while(cur){
      const node = new Node(cur.val)
      map.set(cur , node)
      cur = cur.next
  }
  // 第二次遍历，确定指向
  cur = head
  while(cur){
      // 这里为什么？
     map.get(cur).next = cur.next === null ? null : map.get(cur.next)
  //    map.get(cur).random = cur.random === null ? null : map.get(cur.random)
  //    map.get(cur).next = map.get(cur.next)
     map.get(cur).random = map.get(cur.random)
     cur = cur.next
  }
  return map.get(head)
};
