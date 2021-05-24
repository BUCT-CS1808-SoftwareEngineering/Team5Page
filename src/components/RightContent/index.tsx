import { Tag, Space, Button, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { useModel } from 'umi';
import Avatar from './AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';

export type SiderTheme = 'light' | 'dark';

const ENVTagColor = {
    dev: 'orange',
    test: 'green',
    pre: '#87d068',
};

const GlobalHeaderRight: React.FC = () => {
    const { initialState } = useModel('@@initialState');

    if (!initialState || !initialState.settings) {
        return null;
    }

    const { navTheme, layout } = initialState.settings;
    let className = styles.right;

    if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
        className = `${styles.right}  ${styles.dark}`;
    }
    return (
        <Space className={className}>
            <HeaderSearch
                className={`${styles.action} ${styles.search}`}
                placeholder="站内搜索"
                defaultValue="umi ui"
                options={[
                    { label: <a href="https://umijs.org/zh/guide/umi-ui.html">umi ui</a>, value: 'umi ui' },
                    {
                        label: <a href="next.ant.design">Ant Design</a>,
                        value: 'Ant Design',
                    },
                    {
                        label: <a href="https://protable.ant.design/">Pro Table</a>,
                        value: 'Pro Table',
                    },
                    {
                        label: <a href="https://prolayout.ant.design/">Pro Layout</a>,
                        value: 'Pro Layout',
                    },
                ]}
            />
            <span>
                <Button
                    type="primary"
                    onClick={() => {
                        const hide = message.loading('正在添加');

                        try {
                            console.log("不会掉调用这个接口")
                            // await addAttention({ ...fields });
                            hide();
                            message.success('备份成功');
                            return true;
                        } catch (error) {
                            hide();
                            message.error('备份失败请重试！');
                            return false;
                        }
                    }}
                >
                    备份
                </Button>
            </span>
            <span
                className={styles.action}
                onClick={() => {
                    window.open('https://github.com/BUCT-CS1808-SoftwareEngineering/Team5Page');
                }}
            >
                <QuestionCircleOutlined />
            </span>
            <Avatar />
            {REACT_APP_ENV && (
                <span>
                    <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>
                </span>
            )}
        </Space>
    );
};
export default GlobalHeaderRight;
