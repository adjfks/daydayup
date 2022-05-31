const swap = (nums , i , j) => {
    const temp = nums[i]
    nums[i] = nums[j]
    nums[j] = temp
}
const partition = (nums , l , r) => {
    const pivot = Math.floor(Math.random() * (r - l + 1)) + l
    swap(nums , l , pivot)
    let j = l
    const baseValue = nums[l]
    for(let i = j + 1 ; i <= r ; i++){
        if(nums[i] < baseValue){
            j++
            swap(nums , j , i)
        }
    }
    swap(nums , l , j)
    return j
}
const quickSort = (nums , l , r) => {
    if(l > r) return
    const midIndex = partition(nums , l , r)
    quickSort(nums , l , midIndex - 1)
    quickSort(nums , midIndex + 1 , r)
}