export default (params)=>{

  // 加载中
  uni.showLoading({
    title:"加载中"
  })

  return new Promise((resolve,reject)=>{

    uni.request({
      ...params,
	  header: {
		token: uni.getStorageSync('token')  
	  },
      success(res){
        resolve(res.data);
      },
      fail(err){
        reject(err);
      },
      complete(){
        uni.hideLoading();
      }
    })

  })
}