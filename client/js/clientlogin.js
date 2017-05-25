/**
 * Created by Brett Dixon on 2017-05-24.
 */
document.getElementById("loginButton").addEventListener("click", function() {
    $.ajax({
        url: "/login",
        type: "POST",
        data: {
            username: document.getElementById("usernameInput").value,
            password: document.getElementById("passwordInput").value
        },
        success: function(response) {

            if(response.status === "success") {
                if(response.type === 1){
                    location.href = "/admin"
                } else if (response.type === 2) {
                    location.href = "/kitchen"
                }
            } else {
                $('#adminModal').modal('show');
                // alert(response.message);
                console.log(response.message);
            }
        }
    });
});