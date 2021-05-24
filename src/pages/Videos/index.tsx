import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import UpdateForm from './components/UpdateForm'
import { getVideos,addVideo,deleteVideo,updateVideo } from '@/services/ant-design-pro/api';

/**
 * 添加视频
 *
 * @param fields
 */

const handleAdd = async (fields: API.VideoItem) => {
    const hide = message.loading('正在添加');

    try {
        await addVideo({ ...fields });
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
 * 审核视频
 *
 * @param fields
 */

const handleUpdate = async (fields: {video_ID: number; video_IfShow: boolean}) => {
    const hide = message.loading('正在配置');
    try {
        await updateVideo(fields);
        hide();
        message.success('配置成功');
        return true;
    } catch (error) {
        hide();
        message.error('配置失败请重试！');
        return false;
    }
};
/**
 * 删除视频
 *
 * @param selectedRows
 */

const handleRemove = async (selectedRows: API.VideoItem[]) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;

    try {
        selectedRows.forEach(async element => await deleteVideo({
            video_ID: element.video_ID,
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
    const [createModalVisible, handleModalVisible] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const [currentRow, setCurrentRow] = useState<API.VideoItem>({});
    const [selectedRowsState, setSelectedRows] = useState<API.VideoItem[]>([]);

    const columns: ProColumns<API.VideoItem>[] = [
        {
            title: '博物馆ID',
            dataIndex: 'muse_ID',
        },
        {
            title: '用户ID',
            dataIndex: 'user_ID',
        },
        {
            title: '视频名',
            search:false,
            dataIndex: 'video_Name',
        },
        {
            title: '时长',
            search:false,
            dataIndex: 'video_Time',
        },
        {
            title: '简介',
            search:false,
            dataIndex: 'video_Description',
        },
        {
            title: '是否通过',
            search:false,
            dataIndex: 'video_IfShow',
        },
        {
            title: '视频',
            search:false,
            dataIndex: 'video_Url',
            render:(_,record)=>
                <>
                    <a href={`http://192.144.230.213:8081${record.video_Url}`} target={"_blank"}> 
                        链接
                    </a>
                </>
        },
        {
            title: '操作',
            dataIndex: 'option',
            valueType: 'option',
            render: (_, record) => [
                <a
                    key="config"
                    onClick={() => {
                        handleUpdate({
                            video_ID: record.video_ID,
                            video_IfShow: !record.video_IfShow,
                        });
                    }}
                >
                    更新
                </a>,
            ],
        },
    ];
    return (
        <PageContainer>
            <ProTable<API.VideoItem, API.PageParams>
                headerTitle="查询表格"
                actionRef={actionRef}
                rowKey="video_ID"
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
                request={getVideos}
                search={false}
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
            <UpdateForm 
                title={"新建管理员"}
                updateModalVisible={createModalVisible}
                currentRow={currentRow}
                setCurrentRow={setCurrentRow}
                handleUpdateModalVisible={handleModalVisible}
                handleSubmit={handleAdd}
                proTableRef={actionRef}
                type={"add"}
            />
        </PageContainer>
    );
};

export default TableList;
