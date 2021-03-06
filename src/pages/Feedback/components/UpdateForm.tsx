import React, { Dispatch, SetStateAction,useRef } from 'react';
import {ProFormText,ModalForm, ProFormRate} from '@ant-design/pro-form';
import type {FormInstance} from 'antd';
import { ActionType } from '@ant-design/pro-table';

type UpdateFormProps = {
    title: string;
    updateModalVisible: boolean;
    currentRow: API.FeedbackItem|undefined;
    setCurrentRow: Dispatch<SetStateAction<API.FeedbackItem|undefined>>;
    handleUpdateModalVisible: Dispatch<SetStateAction<boolean>>;
    handleSubmit: (fields: API.FeedbackItem) => Promise<boolean>;
    type: API.UpdateFormType;
    proTableRef: React.MutableRefObject<ActionType | undefined>;
};

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
    const {title,updateModalVisible,currentRow,setCurrentRow,handleUpdateModalVisible,handleSubmit,type,proTableRef} = props;
    const formRef = useRef<FormInstance>();
    return (
        <ModalForm
                formRef={formRef}
                title={title}
                width="400px"
                visible={updateModalVisible}
                onVisibleChange={(visible)=>{
                    if(type === "update" && visible===true){
                        formRef.current?.setFieldsValue(currentRow)
                    }
                    return handleUpdateModalVisible(visible);
                }}
                onFinish={async (value) => {
                    const params = value;
                    delete params.muse_ID;
                    delete params.user_ID;
                    const success = await handleSubmit({
                        ...value,
                        fdback_ID:currentRow?.fdback_ID,
                    } as API.FeedbackItem);
                    if(success){
                        handleUpdateModalVisible(false);
                        setCurrentRow(undefined);
                        formRef.current?.resetFields();
                        proTableRef.current?.reloadAndRest?.();
                    }
                }}
                modalProps={{   
                    onCancel:()=>{
                        setCurrentRow(undefined);
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
                <ProFormRate 
                    name="env_Review"
                    label="????????????"
                    fieldProps={{
                        allowHalf:false,
                    }}
                />
                <ProFormRate 
                    name="exhibt_Review"
                    label="??????????????????"
                    fieldProps={{
                        allowHalf:false,
                    }}
                />
                <ProFormRate 
                    name="service_Review"
                    label="????????????"
                    fieldProps={{
                        allowHalf:false,
                    }}
                />
            </ModalForm>
    );
};

export default UpdateForm;
