
// https://stackoverflow.com/questions/7125320/facebook-login-without-pop-up

window.fbAsyncInit = function() {
    FB.init({
        appId      : '824809551314795',
        cookie     : true,
        xfbml      : true,
        version    : 'v5.0'
    });

    FB.AppEvents.logPageView();

    var uri = encodeURI('https://synthblast.com');
    // FB.getLoginStatus(function(response) {
    //     if (response.status !== 'connected') {
    //         window.location = encodeURI("https://www.facebook.com/dialog/oauth?client_id=824809551314795&redirect_uri="+uri+"&response_type=token");
    //     }
    // });

};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));





// FB.getLoginStatus(function(response) {
//     statusChangeCallback(response);
// });
//
// function statusChangeCallback(response) {
//     console.log(response);
// }