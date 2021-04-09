<template>
    <div class="login-wrapper" :style="{ height: height + 'px' }">
        <div class="logo">
            <img src="~static/img/login/logo.png" style="width:100%" alt="" />
        </div>
        <div>
            <div class="cell">
                <div class="label"><span>手机</span></div>
                <div class="value">
                    <input
                        v-model="phone"
                        type="tel"
                        maxlength="11"
                        name="userame"
                        placeholder="请输入“外研通行证”账号"
                        class="control"
                        @input="e => handleInputPhone(e.target.value, e)"
                    />
                </div>
                <div v-show="!!phone.length" class="icon close" @click="handleClearPhone"></div>
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
        <div class="forget-pwd" @click="handleClickForgetPwd">忘记密码？</div>
        <div class="login-btn" :class="{ disabled: btnDisabled }" @click="handleSubmit">登录</div>
        <div class="no-account" @click="handleNoAccount"><span>还没有账号，去注册</span></div>
        <div class="protocol"
            >登录即代表您已同意悠游<span @click="handleClickService">《服务协议》</span>及<span @click="handleSecret"
                >《隐私条款》</span
            ></div
        >
    </div>
</template>

<script>
import { parse } from "qs";
import Login from "@/apis/login/index";

const exp = /^1[3|4|5|6|7|8|9][0-9]{9}$/;

export default {
    data() {
        return {
            phone: "",
            phoneValid: false,
            password: "",
            pwdInputType: "password",
            height: 0,
        };
    },
    computed: {
        btnDisabled() {
            return !(this.phoneValid && this.password.length);
        },
    },
    mounted() {
        this.initPhone();
        this.height = document.documentElement.clientHeight;
    },
    methods: {
        initPhone() {
            const { phone } = parse(location.search, { ignoreQueryPrefix: true });
            if (phone) {
                this.phone = phone;
                this.phoneValid = exp.test(phone);
            }
        },
        handleClearPhone() {
            this.phone = "";
            this.phoneValid = false;
        },
        handleInputPhone(val) {
            this.phone = val.replace(/[^\d]/g, "");
            this.phoneValid = exp.test(this.phone);
            if (this.phone.length >= 11 && !this.phoneValid) {
                console.log("请输入正确的手机号");
                return;
            }
        },
        handleChangePwdType() {
            const { pwdInputType } = this;
            this.pwdInputType = pwdInputType === "password" ? "text" : "password";
        },
        handleClickForgetPwd() {
            window.location.href = "./reset.html";
        },
        handleNoAccount() {
            window.location.href = "./register.html";
        },
        handleClickService() {
            window.location.href = "https://cdn.unischool.cn/rj/app/dist/useragree.html";
        },
        handleSecret() {
            window.location.href = "https://cdn.unischool.cn/rj/app/dist/privacy.html";
        },
        async handleSubmit() {
            const { phone, password, btnDisabled } = this;
            if (btnDisabled) return;
            const { success, info, errorCode, data } = await Login(phone, password);
            if (!success) {
                if (errorCode === 302) {
                    this.$dialog({
                        content: "该手机号还未注册，请先注册",
                        mainBtn: {
                            label: "去注册",
                            action() {
                                window.location.href = "./register.html";
                            },
                        },
                    });
                    return;
                }
                this.$toast({ content: info });
            } else {
                window.location.href = "./activate.html?accessToken=" + data.accessToken;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.login-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    margin: 0 80px;
    font-family: PingFangSC-Regular, PingFang SC;
    position: relative;
    .logo {
        width: 200px;
        height: 200px;
        margin: 158px auto 90px;
        background: url("~static/img/login/logo.png") no-repeat center center;
        background-size: cover;
    }
    .cell {
        box-sizing: border-box;
        position: relative;
        display: flex;
        width: 100%;
        padding: 32px 0;
        // overflow: hidden;
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
    .forget-pwd {
        text-align: left;
        margin-top: 40px;
        height: 40px;
        font-size: 28px;
        color: rgba(69, 84, 133, 1);
        line-height: 40px;
    }
    .login-btn {
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
    .no-account {
        margin: 40px auto 0;
        span {
            margin: 0 auto;
            width: 275px;
            display: block;
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
