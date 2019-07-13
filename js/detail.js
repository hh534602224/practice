$(()=>{
// 取得本地地址栏的id中的第四位
let id=location.search.substring(4);
// 找打符合ID 的对象数组
let obj=phoneData.find(function(e){
    return e.pID==id;
})
// 根据对象属性设置页面内容
$('.preview-img img').prop('src',obj.imgSrc);
$('.sku-name').text(obj.name);
$('.dd>em').text("￥"+obj.price);

let shu=$('.choose-number');
let add=$('.add');
let reduce=$('.reduce');
let index=1;
// 加
add.on('click',function(){
    index=shu.val();
    index++;
    if(index>=2){
        reduce.removeClass('disabled')
    }
    shu.val(index);
})
// 减
reduce.on('click',function(){
    index=shu.val();
    index--;
    if(index==1){
        reduce.addClass('disabled');
    }
    if(index==0){
        index=1;
    }

    shu.val(index);
})
// // 加入购物车
// $('.addshopcar').on('click',function(){
//     // 获取输入框的数据
//     let number=parseInt(shu.val());
//     // 最右上角购物车数量加上
//     $('.count').text(number);
//     // 从数据库获取最新的数据给到jsonStr
//     let jsonStr=localStorage.getItem('shopCartData');
//     let arr;

// })






})