$(() => {
  let jsonStr = localStorage.getItem('shopCartData');
  // console.log(jsonStr)
  let arr;
  // 当数据库不为空时执行
  if (jsonStr !== null) {
    // 吧空空如也隐藏
    $('.empty-tip').hide();
    // 标题和总计显示
    $('.cart-header').show();
    $('.total-of').show();
    // 把获取的数组转义成数组
    arr = JSON.parse(jsonStr)
    // console.log(arr)
    // 那就按照本地数据库的数据按照格式遍历，展示出来
    let html = '';
    arr.forEach(e => {
      html += `<div class="item" data-id="${e.pID}">
            <div class="row">
              <div class="cell col-1 row">
                <div class="cell col-1">
                  <input type="checkbox" class="item-ck" checked="">
                </div>
                <div class="cell col-4">
                  <img src="${e.imgSrc}" alt="">
                </div>
              </div>
              <div class="cell col-4 row">
                <div class="item-name">${e.name}</div>
              </div>
              <div class="cell col-1 tc lh70">
                <span>￥</span>
                <em class="price">${e.price}</em>
              </div>
              <div class="cell col-1 tc lh70">
                <div class="item-count">
                  <a href="javascript:void(0);" class="reduce fl">-</a>
                  <input autocomplete="off" type="text" class="number fl" value="${e.number}">
                  <a href="javascript:void(0);" class="add fl">+</a>
                </div>
              </div>
              <div class="cell col-1 tc lh70">
                <span>￥</span>
                <em class="computed">${e.price * e.number}</em>
              </div>
              <div class="cell col-1">
                <a href="javascript:void(0);" class="item-del">从购物车中移除</a>
              </div>
            </div>
          </div>`
      //   吧写好的格式放进去
      $('.item-list').html(html);
    });
  } else {
    // 没有数据就空空如也，过去引导购物
    $('.empty-tip').show();
  }

  // console.log($('.item-list input[type=checkbox]:checked'))
  // 计算商品数量总和，商品总价，并且封装函数
  function ProductTotal() {
    let totalnumber = 0;
    let totalmoney = 0;
    // 属性的选择器，获取所有勾选上的复选框
    $('.item-list input[type=checkbox]:checked').each((i,e) => {
      // 获取勾选中的所有自定义属性
      let id=parseInt($(e).parents('.item').attr('data-id'))
      // 让本地数据数组遍历，与勾选的id相配
      arr.forEach(e=>{
        // 只要匹配上的数据就拿出来计算
        if(e.pID==id){
          totalmoney+=e.number*e.price;
          totalnumber+=e.number;
        }
      })

    })
    $('.selected').text(totalnumber);
    $('.total-money').text(totalmoney);
  }
  // 调用计算总数的函数
  ProductTotal();
// 全选按钮的操作，同时修改总计
  $('.pick-all').on('click',function(){
    let state=$(this).prop('checked');
    $('.item-ck').prop('checked',state);
    $('.pick-all').prop('checked',state);
    ProductTotal();
  })
  // 小按钮的判断
  $('.item-ck').on('click',function(){
    // 判断按钮的个数和选中的按钮个数是否一致
    let isqx=$('.item-ck').length==$('.item-ck:checked').length;
    // 如果一致，全选按钮也选上，不一致就不选
    $('.pick-all').attr('checked',isqx);
    // 只要按了小按钮就变一次总数
    ProductTotal();
  })
  // 委托事件完成购物车商品加数量
  $('.item-list').on('click','.add',function(){
    let oldval=parseInt($(this).siblings('input').val());
    oldval++;
    if(oldval>1){
      // 数目大于1就让减号可以按
      $(this).siblings('.reduce').removeClass('disabled');
    }
    $(this).siblings('input').val(oldval);
    // 加了要让数据库的数据也更新
    // 更新的依据是点击按钮对应的商品id
    let id=parseInt($(this).parents('.item').attr('data-id'));
    // 从数据库查找相关id的数据并返回
    let obj=arr.find(e=>{
      return e.pID===id;
    })
    // 更新数据
    obj.number=oldval;
    // 覆盖数据库
    let jsonStr=JSON.stringify(arr);
    localStorage.setItem('shopCartData',jsonStr);
    ProductTotal();
    // 同时把同列的商品总价修改一下,点击对象的父元素去找子元素
    $(this).parents('.item').find('.computed').text(obj.number*obj.price);
  })
    // 委托事件完成购物车商品减数量
    $('.item-list').on('click','.reduce',function(){
      let oldval=$(this).siblings('input').val();
      // 如果已经是1就不给执行程序
      if(oldval==1){
        return;
      }
      oldval--;
      // 剪完后是等于1改改样式，让他不能按
      if(oldval===1){
        $(this).addClass('disabled');
      }
      // 设置数值
      $(this).siblings('input').val(oldval);
      // 获取本列id
      let id=parseInt($(this).parents('.item').attr('data-id'));
      // 找到对象
      let obj=arr.find(e=>{
        return e.pID===id;
      })
      // 该数据
      obj.number=oldval;
      // 覆盖数据库
      let jsonStr=JSON.stringify(arr);
      localStorage.setItem('shopCartData',jsonStr);
      // 重新计算购物车总价
      ProductTotal();
      // 修改行内总价
      $(this).parents('.row').children().children('.computed').text(obj.number*obj.price)

    })
    // 删除购物车的商品
    $('.item-list').on('click','.item-del',function(){
      let santhis=this; // 保存删除对象
     //  let detal=alert('你确定删除？') 没意义，不能用
     //  console.log(detal);
     $("#dialog-confirm").dialog({
       resizable: false,
       height: 140,
       modal: true,
       buttons: {
         "确认": function () {
           $(this).dialog("close");
           // 把对应的商品删除
           // 把对应的结构移除
           $(santhis).parents('.item').remove();
           // 把数据库移除
           // 根据id获取数据库里面的数据
           let id = parseInt($(santhis).parents('.item').attr('data-id'));
           // h5里的，数组新增了一个方法，获取满足条件的元素的索引          
           let index = arr.findIndex((e)=>{
             return e.pID === id
           })
          //  根据索引删除数据
           arr.splice(index, 1);
           // 把数据覆盖回本地
           let jsonStr = JSON.stringify(arr);
           localStorage.setItem('shopCartData', jsonStr);
         },
         "取消": function () {
           $(this).dialog("close");
         }
       }
     });
 
     })



})