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
// 加入购物车
$('.addshopcar').on('click',function(){
    // 获取输入框的数据
    let number=parseInt(shu.val());
    // 从数据库获取最新的数据给到jsonStr
    let jsonStr=localStorage.getItem('shopCartData');
    let arr;
    // 判断获得的新数据是否为空，就是有没有数据
    // 没有新数据的话arr就为空
    if(jsonStr===null){
        arr=[];
    }else{
        // 如果有数据就把数据放进去数据
        arr=JSON.parse(jsonStr);
    }
    /* 还有一种情况，如果同一件商品点击2次以上，会生成2个商品，
    我们要过滤这种信息，让他如果数据库已经有了这个商品就只是数量加，不生成新商品 */
    // find是查找arr数组里面是否有某个元素
    let iscunzai=arr.find(e=>{
        /* 如果这个数组有这个商品，那么arr数组就会有一个数组里面的对象是和当前页面的id是相同的
        那么久判断里面是否有这个元素，如果没有就会返回underfind,有个话就返回他找的的元素给他，也就是对象 */
        return e.pID==id
    })
if(iscunzai==undefined){
    /* 如果没有本页面的数据，就是说是个新商品了，就要创建对象吧他存进去数组arr里面去
    其实要存起来的数据和上个页面数据是一样的，就是多了一个你要购买的商品量而已,实际来说，id是全购物
    网唯一的，只需要存id和数量就行了，到了页面再根据id从服务器获取*/
    let now={
        pID:obj.pID,
        number:number
    }
    arr.push(now);
}else{
    // 如果已经有了数据，就直接加上数量就好了
    iscunzai.number+=number;
}
// 然后把arr数据转义存进去数据库
jsonStr=JSON.stringify(arr);
localStorage.setItem('shopCartData',jsonStr);
// 最后跳转到购物车结算页面
location.href='cart.html'

})// 购物车点击事件结束


})