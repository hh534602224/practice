// 吧数据库的购物车总商品数写入到右上角的冒泡里面
$(()=>{
    let arr=''
arr=loadData('shopCartData')
// console.log(arr)
let totalnumber=0;
arr.forEach(e=> {
    totalnumber+=e.number; 
});

$('.shopcar>.count').text(totalnumber);
})
