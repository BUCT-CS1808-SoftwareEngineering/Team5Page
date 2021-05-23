import React, { Dispatch, SetStateAction,useRef } from 'react';
import {ProFormText,ModalForm, ProFormUploadDragger, ProFormTextArea} from '@ant-design/pro-form';
import {FormInstance, message} from 'antd';
import { ActionType } from '@ant-design/pro-table';
import { addVideo } from '@/services/ant-design-pro/api';


type UpdateFormProps = {
    title: string;
    updateModalVisible: boolean;
    currentRow: API.VideoItem;
    setCurrentRow: Dispatch<SetStateAction<API.VideoItem>>;
    handleUpdateModalVisible: Dispatch<SetStateAction<boolean>>;
    handleSubmit: (fields: API.VideoItem) => Promise<boolean>;
    type: API.UpdateFormType;
    proTableRef: React.MutableRefObject<ActionType | undefined>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
    const {title,updateModalVisible,currentRow,setCurrentRow,handleUpdateModalVisible,handleSubmit,proTableRef} = props;
    const formRef = useRef<FormInstance>();
    return (
        <ModalForm
                formRef={formRef}
                title={title}
                width="400px"
                visible={updateModalVisible}
                onVisibleChange={handleUpdateModalVisible}
                onFinish={async (value) => {
                    const success = await handleSubmit({
                        ...value,
                        video_ID:currentRow.video_ID,
                    } as API.VideoItem);
                    if(success){
                        handleUpdateModalVisible(false);
                        setCurrentRow({});
                        formRef.current?.resetFields();
                        proTableRef.current?.reloadAndRest?.();
                    }
                }}
                modalProps={{
                    onCancel:()=>{
                        setCurrentRow({});
                        formRef.current?.resetFields();
                    }
                    
                }}
            >
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '博物馆ID为必填项',
                        }
                    ]}
                    label="博物馆ID"
                    placeholder='博物馆ID'
                    width="md"
                    name="muse_ID"
                />
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '用户ID为必填项',
                        }
                    ]}
                    label='用户ID'
                    placeholder='用户ID'
                    width="md"
                    name="user_ID"
                />
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '视频名为必填项',
                        }
                    ]}
                    label="视频名"
                    placeholder='视频名'
                    width="md"
                    name="video_Name"
                />
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '视频时长为必填项',
                        }
                    ]}
                    label="视频时长"
                    placeholder='视频时长'
                    width="md"
                    name="video_Time"
                />
                <ProFormTextArea
                    rules={[
                        {
                            required: true,
                            message: '视频描述为必填项',
                        }
                    ]}
                    label='视频描述'
                    placeholder='视频描述'
                    width="md"
                    name="video_Description"
                />
                <ProFormUploadDragger
                    max={4}
                    label="视频"
                    name="file"
                    fieldProps={{
                        customRequest: async (file) => {

                            const formData = new FormData();
                            formData.append('file',file.file,"[PROXY]");
                            formData.append("user_ID", currentRow?.user_ID.toString() as string);
                            formData.append("muse_ID", currentRow?.muse_ID.toString() as string);
                            formData.append("video_Time", currentRow?.video_Time?.toString() as string);
                            formData.append("video_Description", currentRow?.video_Desciption?.toString() as string);
                            const hide = message.loading('正在添加');
                            try {
                                await addVideo(formData);
                                hide();
                                message.success('添加成功');
                                return true;
                            } catch (error) {
                                hide();
                                message.error('添加失败请重试！');
                                return false;
                            }
                        }
                    }}
                />
            </ModalForm>
    );
};

export default UpdateForm;
