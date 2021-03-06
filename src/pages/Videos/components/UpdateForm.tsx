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
                            message: '?????????ID????????????',
                        }
                    ]}
                    label="?????????ID"
                    placeholder='?????????ID'
                    width="md"
                    name="muse_ID"
                />
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '??????ID????????????',
                        }
                    ]}
                    label='??????ID'
                    placeholder='??????ID'
                    width="md"
                    name="user_ID"
                />
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '?????????????????????',
                        }
                    ]}
                    label="?????????"
                    placeholder='?????????'
                    width="md"
                    name="video_Name"
                />
                <ProFormText
                    rules={[
                        {
                            required: true,
                            message: '????????????????????????',
                        }
                    ]}
                    label="????????????"
                    placeholder='????????????'
                    width="md"
                    name="video_Time"
                />
                <ProFormTextArea
                    rules={[
                        {
                            required: true,
                            message: '????????????????????????',
                        }
                    ]}
                    label='????????????'
                    placeholder='????????????'
                    width="md"
                    name="video_Description"
                />
                <ProFormUploadDragger
                    max={4}
                    label="??????"
                    name="file"
                    fieldProps={{
                        customRequest: async (file) => {

                            const formData = new FormData();
                            formData.append('file',file.file,"[PROXY]");
                            formData.append("user_ID", currentRow?.user_ID.toString() as string);
                            formData.append("muse_ID", currentRow?.muse_ID.toString() as string);
                            formData.append("video_Time", currentRow?.video_Time?.toString() as string);
                            formData.append("video_Description", currentRow?.video_Desciption?.toString() as string);
                            const hide = message.loading('????????????');
                            try {
                                await addVideo(formData);
                                hide();
                                message.success('????????????');
                                return true;
                            } catch (error) {
                                hide();
                                message.error('????????????????????????');
                                return false;
                            }
                        }
                    }}
                />
            </ModalForm>
    );
};

export default UpdateForm;
