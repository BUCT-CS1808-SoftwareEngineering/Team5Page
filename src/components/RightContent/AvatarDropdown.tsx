import React, { useCallback } from 'react';
import { LogoutOutlined } from '@ant-design/icons';
import { Menu, Spin } from 'antd';
import { history, useModel } from 'umi';
import { stringify } from 'querystring';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { outLogin } from '@/services/ant-design-pro/api';

export type GlobalHeaderRightProps = {
    menu?: boolean;
};

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
    outLogin();
    const { query = {}, pathname } = history.location;
    const { redirect } = query;
    // Note: There may be security issues, please note
    if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
            pathname: '/user/login',
            search: stringify({
                redirect: pathname,
            }),
        });
    }
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = () => {
    const { initialState, setInitialState } = useModel('@@initialState');

    const onMenuClick = useCallback(
        (event: {
            key: React.Key;
            keyPath: React.Key[];
            item: React.ReactInstance;
            domEvent: React.MouseEvent<HTMLElement>;
        }) => {
            const { key } = event;
            if (key === 'logout' && initialState) {
                setInitialState({ ...initialState, currentUser: undefined });
                loginOut();
                return;
            }
            history.push(`/account/${key}`);
        },
        [initialState, setInitialState],
    );

    const loading = (
        <span className={`${styles.action} ${styles.account}`}>
            <Spin
                size="small"
                style={{
                    marginLeft: 8,
                    marginRight: 8,
                }}
            />
        </span>
    );

    if (!initialState) {
        return loading;
    }
    const { currentUser } = initialState;
    if (!currentUser || !currentUser.info) {
        return loading;
      }
    const menuHeaderDropdown = (
        <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
            <Menu.Item key="logout">
                <LogoutOutlined />
                退出登录
            </Menu.Item>
        </Menu>
    );
    return (
        <HeaderDropdown overlay={menuHeaderDropdown}>
            <span className={`${styles.action} ${styles.account}`}>
                <span className={`${styles.name} anticon`}>{currentUser.info.name}</span>
            </span>
        </HeaderDropdown>
    );
};

export default AvatarDropdown;
