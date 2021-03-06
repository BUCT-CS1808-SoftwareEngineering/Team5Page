import {
    LockOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Alert, Space, message } from 'antd';
import React, { useState } from 'react';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { useIntl, Link, history, useModel } from 'umi';
import Footer from '@/components/Footer';
import { login } from '@/services/ant-design-pro/api';
import styles from './index.less';

const LoginMessage: React.FC<{
    content: string;
}> = ({ content }) => (
    <Alert
        style={{
            marginBottom: 24,
        }}
        message={content}
        type="error"
        showIcon
    />
);
/** 此方法会跳转到 redirect 参数所在的位置 */

const goto = () => {
    if (!history) return;
    setTimeout(() => {
        const { query } = history.location;
        const { redirect } = query as {
            redirect: string;
        };
        history.push(redirect || '/museum/info');
    }, 10);
};

const Login: React.FC = () => {
    const [submitting, setSubmitting] = useState(false);
    const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
    const { initialState, setInitialState } = useModel('@@initialState');
    const intl = useIntl();

    const fetchUserInfo = async () => {
        const userInfo = await initialState?.fetchUserInfo?.();

        if (userInfo) {
            setInitialState({ ...initialState, currentUser: userInfo });
        }
    };

    const handleSubmit = async (values: API.LoginParams) => {
        setSubmitting(true);

        try {
            // 登录
            const msg = await login({ ...values });
            if (msg.code === "success") {
                const defaultloginSuccessMessage = "登陆成功"
                sessionStorage.setItem("currentToken",msg.token);
                message.success(defaultloginSuccessMessage);
                await fetchUserInfo();
                goto();
                return;
            } // 如果失败去设置用户错误信息

            setUserLoginState(msg);
        } catch (error) {
            const defaultloginFailureMessage = '登录失败，请重试！'
            message.error(defaultloginFailureMessage);
        }

        setSubmitting(false);
    };

    const { code } = userLoginState;
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.top}>
                    <div className={styles.header}>
                        <Link to="/">
                            <img alt="logo" className={styles.logo} src="/logo.svg" />
                            <span className={styles.title}>博物馆</span>
                        </Link>
                    </div>
                    <div className={styles.desc}>
                        {intl.formatMessage({
                            id: '来自计科1808的课设',
                        })}
                    </div>
                </div>

                <div className={styles.main}>
                    <ProForm
                        initialValues={{
                            autoLogin: true,
                        }}
                        submitter={{
                            searchConfig: {
                                submitText: '登录'
                            },
                            render: (_, dom) => dom.pop(),
                            submitButtonProps: {
                                loading: submitting,
                                size: 'large',
                                style: {
                                    width: '100%',
                                },
                            },
                        }}
                        onFinish={async (values) => {
                            handleSubmit(values as API.LoginParams);
                        }}
                    >

                        {code === "error" && (
                            <LoginMessage
                                content={'账户或密码错误（admin/ant.design)'}
                            />
                        )}
                                <ProFormText
                                    name="admin_Name"
                                    fieldProps={{
                                        size: 'large',
                                        prefix: <UserOutlined className={styles.prefixIcon} />,
                                    }}
                                    placeholder={'用户名:'}
                                    rules={[
                                        {
                                            required: true,
                                            message: '用户名是必填项！',
                                        },
                                    ]}
                                />
                                <ProFormText.Password
                                    name="admin_Passwd"
                                    fieldProps={{
                                        size: 'large',
                                        prefix: <LockOutlined className={styles.prefixIcon} />,
                                    }}
                                    placeholder={'密码:'}
                                    rules={[
                                        {
                                            required: true,
                                            message: '密码是必填项！',
                                        },
                                    ]}
                                />
                        <div
                            style={{
                                marginBottom: 24,
                            }}
                        >
                        </div>
                    </ProForm>
                    
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Login;
