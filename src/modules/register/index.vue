<template>
    <div class="register-wrapper" :style="{ height: height + 'px' }">
        <div class="title"><span>注册“外研通行证”账号</span></div>
        <div class="tips">注册后，您可以使用“外研通行证”账号登录外研社旗下多款数字产品</div>
        <div>
            <div class="cell">
                <div class="label"><span>手机</span></div>
                <div class="value">
                    <input
                        v-model="phone"
                        type="tel"
                        maxlength="11"
                        name="userame"
                        placeholder="请输入手机号"
                        class="control"
                        @input="e => handleInputPhone(e.target.value, e)"
                    />
                </div>
                <div v-show="!!phone.length" class="icon close" @click="handleClearPhone"></div>
            </div>
            <div class="cell">
                <div class="label"><span>验证码</span></div>
                <div class="value">
                    <input
                        v-model="verifiyCode"
                        type="tel"
                        name="verifycode"
                        placeholder="请输入验证码"
                        class="control"
                    />
                </div>
                <div class="verify-wrapper">
                    <span v-if="remainTime > 0" class="time-span">{{ remainTime }}s</span>
                    <span v-else class="text-span" @click="handleGetVerifyCode">获取验证码</span>
                </div>
            </div>
            <div class="cell">
                <div class="label"><span>密码</span></div>
                <div class="value">
                    <input
                        v-model="password"
                        :type="pwdInputType"
                        name="password"
                        placeholder="请输入密码"
                        class="control"
                    />
                </div>
                <div
                    class="icon"
                    :class="pwdInputType === 'password' ? 'hidden' : 'display'"
                    @click="handleChangePwdType"
                ></div>
            </div>
        </div>
        <div class="info">密码必须由英文字母及数字组成，长度为6-12位</div>
        <div class="register-btn" :class="{ disabled: btnDisabled }" @click="handleSubmit">注册</div>
        <div class="has-account" @click="handleGoLogin"><span>已有账号，去登录</span></div>
        <div class="protocol"
            >登录即代表您已同意悠游<span @click="handleClickService">《服务协议》</span>及<span @click="handleSecret"
                >《隐私条款》</span
            ></div
        >
    </div>
</template>

<script>
import Register from "@/apis/register/index";
import CaptchaRegister from "@/apis/captcha/register";
export default {
    data() {
        return {
            phone: "",
            phoneValid: false,
            password: "",
            pwdInputType: "password",
            verifiyCode: "",
            verifiyStatus: 0,
            remainTime: -1,
            timer: null,
            height: 0,
        };
    },
    computed: {
        btnDisabled() {
            return !(this.phoneValid && this.password.length && this.verifiyCode.length);
        },
    },
    mounted() {
        this.height = document.documentElement.clientHeight;
    },
    methods: {
        async handleSubmit() {
            const { phone, password, verifiyCode, btnDisabled } = this;
            if (btnDisabled) return;
            const { success, info } = await Register(phone, password, verifiyCode);
            if (!success) {
                this.$toast({ content: info });
            } else {
                this.$toast({ content: "注册成功" });
                setTimeout(() => {
                    window.location.href = `./login.html?phone=${phone}`;
                }, 500);
            }
        },
        handleClearPhone() {
            this.phone = "";
            this.phoneValid = false;
        },
        handleClickService() {
            window.location.href = "https://cdn.unischool.cn/rj/app/dist/useragree.html";
        },
        handleSecret() {
            window.location.href = "https://cdn.unischool.cn/rj/app/dist/privacy.html";
        },
        handleGoLogin() {
            window.location.href = "./login.html";
        },
        handleInputPhone(val) {
            this.phone = val.replace(/[^\d]/g, "");
            const exp = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
            this.phoneValid = exp.test(this.phone);
            if (this.phone.length >= 11 && !this.phoneValid) {
                console.log("请输入正确的手机号");
                return;
            }
        },
        async handleGetVerifyCode() {
            const { verifiyStatus, remainTime, phone } = this;
            if (verifiyStatus) return;
            const { success, errorCode, info } = await CaptchaRegister(phone);
            if (errorCode) {
                if (errorCode === 303) {
                    this.$dialog({
                        content: "你已注册过“外研通行证”账号，请用对应密码登录。",
                        mainBtn: {
                            label: "去登录",
                            action() {
                                window.location.href = "./login.html";
                            },
                        },
                    });
                    return;
                }
                this.$toast({ content: info });
            }
            if (success) {
                this.$toast({ content: "短信验证码已发送" });
                this.remainTime = 60;
                this.verifiyStatus = 1;
                const loopTime = () => {
                    if (remainTime < 0) {
                        clearTimeout(this.timer);
                        this.verifiyStatus = 0;
                    }
                    --this.remainTime;
                    this.timer = setTimeout(() => {
                        loopTime();
                    }, 1000);
                };
                loopTime();
            }
        },
        handleChangePwdType() {
            const { pwdInputType } = this;
            this.pwdInputType = pwdInputType === "password" ? "text" : "password";
        },
    },
};
</script>

<style lang="scss" scoped>
.register-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    margin: 0 80px;
    font-family: PingFangSC-Regular, PingFang SC;
    position: relative;
    .header {
        position: absolute;
        height: 88px;
        left: -80px;
        right: -80px;
        top: 88px;
        .back {
            display: block;
            position: absolute;
            width: 18px;
            height: 34px;
            background: url("~static/img/register/ic_back.png") no-repeat center center;
            background-size: cover;
            top: 50%;
            transform: translateY(-50%);
            left: 30px;
        }
    }
    .title {
        margin-top: 100px;
        text-align: left;
        width: 100%;
        height: 68px;
        font-size: 48px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(5, 5, 7, 1);
        line-height: 68px;
    }
    .tips {
        font-size: 28px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(65, 65, 72, 1);
        line-height: 40px;
        margin-bottom: 20px;
    }
    .cell {
        position: relative;
        display: flex;
        box-sizing: border-box;
        width: 100%;
        padding: 32px 0;
        color: #323233;
        font-size: 32px;
        background-color: #fff;
        border-bottom: 0.5px solid #ebf0f5;
        .label {
            flex: none;
            box-sizing: border-box;
            height: 44px;
            line-height: 44px;
            font-weight: 400;
            color: #050507;
            width: 100px;
            margin-right: 12px;
            color: #050507;
            text-align: left;
        }
        .value {
            height: 44px;
            line-height: 44px;
            position: relative;
            overflow: visible;
            color: #969799;
            text-align: right;
            vertical-align: middle;
            word-wrap: break-word;
            flex: 1;
            input {
                font: inherit;
            }
            .control {
                display: block;
                box-sizing: border-box;
                width: 100%;
                height: 100%;
                min-width: 0;
                margin: 0;
                padding: 0;
                color: #323233;
                line-height: inherit;
                text-align: left;
                background-color: transparent;
                border: 0;
                resize: none;
                outline: 0;
                &::placeholder {
                    color: #bcc6d1;
                }
            }
        }
        .icon {
            width: 48px;
            height: 48px;
        }
        .verify-wrapper {
            width: 180px;
            height: 100%;
            border-left: 1px solid #ebf0f5;
            .text-span {
                display: block;
                font-size: 28px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: rgba(69, 84, 133, 1);
                line-height: 40px;
                text-align: right;
            }
            .time-span {
                display: block;
                font-size: 28px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: rgba(69, 84, 133, 1);
                line-height: 40px;
                text-align: center;
            }
        }
        .close {
            background: url("~static/img/login/ic_close.png") no-repeat center center;
            background-size: cover;
        }
        .hidden {
            background: url("~static/img/login/ic_password_hidden.png") no-repeat center center;
            background-size: cover;
        }
        .display {
            background: url("~static/img/login/ic_password_display.png") no-repeat center center;
            background-size: cover;
        }
    }
    .info {
        margin-top: 40px;
        padding: 0 10px 0 48px;
        font-size: 28px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(65, 65, 72, 1);
        line-height: 40px;
        position: relative;
        &::before {
            position: absolute;
            display: block;
            left: 0;
            top: 3px;
            width: 32px;
            height: 32px;
            background: url("~static/img/reset/ic_info.png") no-repeat center center;
            background-size: cover;
            content: " ";
        }
    }
    .register-btn {
        margin: 80px auto 0;
        text-align: center;
        width: 600px;
        height: 96px;
        background: url("~static/img/login/btn_bg.png") no-repeat center center;
        background-size: cover;
        font-family: PingFangSC-Medium, PingFang SC;
        font-size: 32px;
        color: rgba(255, 255, 255, 1);
        line-height: 96px;
    }
    .disabled {
        background: url("~static/img/login/btn_bg_disabled.png") no-repeat center center;
        background-size: cover;
    }
    .has-account {
        margin: 40px auto 0;
        span {
            margin: 0 auto;
            display: block;
            width: 245px;
            height: 40px;
            font-size: 28px;
            font-weight: 400;
            color: rgba(69, 84, 133, 1);
            line-height: 40px;
            padding-right: 28px;
            text-align: center;
            position: relative;
            &::after {
                position: absolute;
                display: inline-block;
                width: 24px;
                height: 24px;
                background: url("~static/img/login/ic_arrow.png") no-repeat center center;
                background-size: cover;
                top: 50%;
                transform: translateY(-50%);
                right: 0;
                content: " ";
            }
        }
    }
    .protocol {
        text-align: center;
        margin: 50px auto 0;
        height: 32px;
        font-size: 24px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(107, 107, 107, 1);
        line-height: 32px;
        span {
            color: #455485;
        }
    }
}
</style>
