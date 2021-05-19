import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Drawer } from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import type { FormValueType } from './components/UpdateForm';
import { updateRule } from '@/services/ant-design-pro/api';

import { getNews, addNews, deleteNews } from '@/services/ant-design-pro/api';
/**
 * 添加新闻
 *
 * @param fields
 */

const handleAdd = async (fields: API.NewItem) => {
    const hide = message.loading('正在添加');

    try {
        await addNews({ ...fields });
        hide();
        message.success('添加成功');
        return true;
    } catch (error) {
        hide();
        message.error('添加失败请重试！');
        return false;
    }
};
/**
 * 删除新闻
 *
 * @param selectedRows
 */

const handleRemove = async (selectedRows: API.NewItem[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;

    try {
        selectedRows.forEach(async element => await deleteNews({
            news_ID: element.news_ID,
        }));
        hide();
        message.success('删除成功');
        return true;
    } catch (error) {
        hide();
        message.error('删除失败，请重试');
        return false;
    }
};

const TableList: React.FC = () => {
    /** 新建窗口的弹窗 */
    const [createModalVisible, handleModalVisible] = useState<boolean>(false);
    /** 分布更新窗口的弹窗 */

    const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const [currentRow, setCurrentRow] = useState<API.NewItem>();
    const [selectedRowsState, setSelectedRows] = useState<API.NewItem[]>([]);
    /** 国际化配置 */

    const intl = useIntl();
    const columns: ProColumns<API.NewItem>[] = [
        {
            title: '标题',
            dataIndex: 'news_Name',
            search:false,
        },
        {
            title: '内容',
            dataIndex: 'news_Content',
            search: false,
        },
        {
            title: '类型',
            dataIndex: 'news_type',
            search: false,
        },
        {
            title: '时间',
            dataIndex: 'news_time',
            search: false,
        },
        {
            title: '来源',
            dataIndex: 'news_source',
            search: false,
        }
    ];
    return (
        <PageContainer>
            <ProTable<API.MuseumListItem, API.PageParams>
                headerTitle={intl.formatMessage({
                    id: 'pages.searchTable.title',
                    defaultMessage: '查询表格',
                })}
                actionRef={actionRef}
                rowKey="news_ID"
                search={false}
                toolBarRender={() => [
                    <Button
                        type="primary"
                        key="primary"
                        onClick={() => {
                            handleModalVisible(true);
                        }}
                    >
                        <PlusOutlined /> 新建
                    </Button>,
                ]}
                request={getNews}
                columns={columns}
                rowSelection={{
                    onChange: (_, selectedRows) => {
                        setSelectedRows(selectedRows);
                    },
                }}
            />
            {selectedRowsState?.length > 0 && (
                <FooterToolbar
                    extra={
                        <div>
                            已选择{' '}
                            <a
                                style={{
                                    fontWeight: 600,
                                }}
                            >
                                {selectedRowsState.length}
                            </a>{' '}
                            项 &nbsp;&nbsp;
                        </div>
                    }
                >
                    <Button
                        onClick={async () => {
                            await handleRemove(selectedRowsState);
                            setSelectedRows([]);
                            actionRef.current?.reloadAndRest?.();
                        }}
                    >
                        批量删除
                    </Button>
                </FooterToolbar>
            )}
            <ModalForm
                title={intl.formatMessage({
                    id: 'pages.searchTable.createForm.增加新闻',
                    defaultMessage: '增加新闻',
                })}
                width="400px"
                visible={createModalVisible}
                onVisibleChange={handleModalVisible}
                onFinish={async (value) => {
                    const success = await handleAdd(value as API.NewItem);

                    if (success) {
                        handleModalVisible(false);

                        if (actionRef.current) {
                            actionRef.current.reload();
                        }
                    }
                }}
            >
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '新闻标题为必填项',
                        },
                    ]}
                    placeholder='新闻标题'
                    width="md"
                    name="news_Name"
                />
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '博物馆名为必填项',
                        },
                    ]}
                    placeholder='博物馆名'
                    width="md"
                    name="muse_Name"
                />
                <ProFormTextArea
                    rules={[
                        {
                            required: true,
                            message: '新闻内容为必填项',
                        },
                    ]}
                    placeholder='新闻内容'
                    width="md"
                    name="news_Content"
                />
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '类型为必填项',
                        },
                    ]}
                    placeholder='类型'
                    width="md"
                    name="news_type"
                />
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '时间为必填项',
                        },
                    ]}
                    placeholder='时间'
                    width="md"
                    name="news_time"
                />
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '来源为必填项',
                        },
                    ]}
                    placeholder='新闻来源'
                    width="md"
                    name="news_source"
                />
            </ModalForm>
        </PageContainer>
    );
};

export default TableList;
