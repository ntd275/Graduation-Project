const validatePassword = (password) => {
    if (password.length < 6) {
        return "Mật khẩu cần tối thiểu 6 kí tự";
    }
    var reg = [/[a-z]/, /[A-Z]/, /[0-9]/, /[!@#$%^&*]/];
    var count = 0;
    for (var i = 0; i < reg.length; i++) {
        if (reg[i].test(password)) {
            count++;
        }
    }
    if (count < 3) {
        return "Mật khẩu phải gồm 3 trong 4 loại: chữ thường, chữ hoa, chữ số, kí tự đặc biệt"
    }
    return "";
};

const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

export {validatePassword, validateEmail}
