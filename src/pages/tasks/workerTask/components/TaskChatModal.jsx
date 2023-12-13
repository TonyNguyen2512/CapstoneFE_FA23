import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Col,
  Divider,
  Dropdown,
  Empty,
  Form,
  Image,
  Input,
  Row,
  Space,
  Spin,
  Typography,
  Upload,
  message,
} from "antd";
import BaseModal from "../../../../components/BaseModal";
import CommentApi from "../../../../apis/comment";
import moment from "moment";
import {
  Check,
  CheckSmall,
  Close,
  CloseSmall,
  Comments,
  Delete,
  Edit,
  SendOne,
  UploadPicture,
} from "@icon-park/react";
import { UserContext } from "../../../../providers/user";
import { MoreOutlined } from "@ant-design/icons";
import { ErrorImage } from "../../../../constants/enum";
import useMicrosoftSignalR from "../../../../hooks/microsoftSignalr";
import { HubConnectionState } from "@microsoft/signalr";
import { ROLE_MAP } from "../../../../constants/app";
import { imagesCommentRef } from "../../../../middleware/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const { Title, Text } = Typography;

export const TaskChatModal = ({ open, onCancel, dataSource }) => {
  const formChatUpdateRef = useRef();
  const { user } = useContext(UserContext);
  const { createMicrosoftSignalrConnection, ECommentHub } = useMicrosoftSignalR();
  const { id, name, createByName, startTime, endTime, members } = dataSource || [];

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(-1);
  const [listComment, setListComment] = useState([]);
  const [hoveringCmt, setHoveringCmt] = useState();
  const [editingCmt, setEditingCmt] = useState();
  const [connection, setConnection] = useState();
  const [newCmtContent, setNewCmtContent] = useState();
  const countRef = useRef(0);
  const imageUrlsRef = useRef([]);

  useEffect(() => {
    console.log({ open, id });
    (async () => {
      if (open) {
        setLoading(true);
        const newConnect = createMicrosoftSignalrConnection("/commentHub");
        setConnection(newConnect);

        newConnect?.on(id?.toString(), async (res) => {
          console.log({ res });
          await getComments();
        });

        await getComments();
        setLoading(false);
      } else {
        connection?.off(id);
        connection?.stop();
        setConnection();
        setLoading(false);
        setListComment([]);
      }
    })();
  }, [open]);

  const getComments = async () => {
    const res = await CommentApi.getCommentByWorkerTaskId(id);
    setListComment(res);
  };
  const addComment = async () => {
    if (!newCmtContent && !imageUrlsRef.current.length) return;
    try {
      setLoading(true);
      const resp = await CommentApi.createComment({
        workerTaskId: id,
        commentContent: newCmtContent || "",
        resource: imageUrlsRef.current,
      });
      if (resp) {
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
    } finally {
      imageUrlsRef.current = [];
      countRef.current = 0;
      setNewCmtContent();
    }
  };

  const updateComment = async (obj) => {
    console.log({ obj, formChatUpdateRef });
    try {
      setLoading(true);
      await CommentApi.updateComment(obj);
      formChatUpdateRef.current.setFieldValue("commentContent", undefined);
      setEditingCmt();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (id) => {
    try {
      setLoading(true);
      await CommentApi.deleteComment(id);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const getActionComments = (comment) => {
    let listClone = [];
    if (comment?.commentContent?.length > 0) {
      listClone.push({
        key: "UPDATE_DETAIL",
        label: "Cập nhật thông tin",
        icon: <Edit />,
        onClick: () => setEditingCmt(comment.id),
      });
    }
    return [
      ...listClone,
      {
        key: "DELETE_DETAIL",
        label: "Xoá thông tin",
        icon: <Delete />,
        danger: true,
        onClick: () => deleteComment(comment?.id),
      },
    ];
  };

  const handleUploadImages = (event) => {
    setLoading(true);
    const file = event.file;
    const fileName = event.file?.name;
    const uploadTask = uploadBytesResumable(ref(imagesCommentRef, fileName), file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        // update progress
        setProgress(percent);
      },
      (err) => {
        console.log(err);
        message.error(`Failed to upload '${fileName}'`);
        setLoading(false);
      },
      () => {
        setProgress(-1);
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          // do something with the download url
          imageUrlsRef.current.push(url);
          countRef.current += 1;
          console.log(event.fileList.length);
          if (countRef.current === event.fileList.length) {
            console.log(countRef);
            console.log(imageUrlsRef);
            addComment();
          }
        });
      }
    );
    setLoading(false);
  };

  return (
    <BaseModal open={open} footer={null} width={1000} onCancel={onCancel}>
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Title level={3}>
              <span className="text-[#DDB850]">{name}</span>
            </Title>
          </Col>
          <Col span={24}>
            <span>
              <b className="pr-1">Quản lý:</b>
              <span>{createByName}</span>
            </span>
          </Col>
          <Col span={12}>
            <span>
              <b className="pr-1">Ngày bắt đầu:</b>
              <span>{moment(startTime).format("DD/MM/YYYY")}</span>
            </span>
          </Col>
          <Col span={12}>
            <span>
              <b className="pr-1">Ngày kết thúc:</b>
              <span>{moment(endTime).format("DD/MM/YYYY")}</span>
            </span>
          </Col>
          <Col span={24}>
            <Divider className="my-2" />
          </Col>
          <Col span={24}>
            <Space align="center">
              <Comments theme="outline" size="22" fill="#000" />
              <Title className="p-0 m-0" level={4}>
                Bình luận
              </Title>
            </Space>
          </Col>
          {listComment?.length > 0 ? (
            <Col span={24} className="grid grid-cols-1 gap-y-2">
              {listComment?.map((x, i) => {
                return (
                  <div
                    key={i}
                    className="flex gap-x-2.5"
                    onMouseEnter={() => setHoveringCmt(x.id)}
                    onMouseLeave={() => setHoveringCmt()}
                  >
                    <Image
                      preview={false}
                      className="rounded-full"
                      src={x.user?.image}
                      fallback={ErrorImage}
                      width={50}
                      height={50}
                    />
                    <Space direction="vertical" size={0}>
                      <Space
                        direction="vertical"
                        size={0}
                        className="px-2 py-1 bg-[#ddb85020] rounded-lg"
                      >
                        {x.user && (
                          <span>
                            <b className="mr-2">{x.user?.fullName}</b>
                            <small>
                              ({user?.id == x.user?.id ? "Bạn" : ROLE_MAP[x.user?.role?.name]})
                            </small>
                          </span>
                        )}
                        {editingCmt == x.id ? (
                          <Form
                            key={i}
                            ref={formChatUpdateRef}
                            onFinish={updateComment}
                            initialValues={x}
                          >
                            <div className="flex gap-x-2">
                              <Form.Item name="id" hidden />
                              <Form.Item name="workerTaskId" hidden />
                              <Form.Item
                                name="commentContent"
                                className="w-full m-0"
                                rules={[
                                  {
                                    required: true,
                                    message: "Vui lòng nhập nội dung",
                                  },
                                ]}
                              >
                                <Input
                                  placeholder="Nhập bình luận..."
                                  allowClear
                                  onPressEnter={() => formChatUpdateRef.current?.submit()}
                                />
                              </Form.Item>
                              <CheckSmall
                                size="30"
                                fill="green"
                                onClick={() => formChatUpdateRef.current?.submit()}
                              />
                              <CloseSmall size="30" fill="red" onClick={() => setEditingCmt()} />
                            </div>
                          </Form>
                        ) : (
                          <span>{x.commentContent}</span>
                        )}
                      </Space>
                      <small>{x.commentTime ? moment(x.commentTime)?.fromNow() : ""}</small>
                    </Space>
                    {user?.id == x.user?.id && (
                      <div>
                        <Dropdown menu={{ items: getActionComments(x) }}>
                          <MoreOutlined
                            hidden={hoveringCmt !== x.id}
                            className="p-2 bg-[#ddb85020] rounded-full"
                          />
                        </Dropdown>
                      </div>
                    )}
                  </div>
                );
              })}
            </Col>
          ) : (
            <Col span={24}>
              <Empty description="Chưa có bình luận" />
            </Col>
          )}
          {!editingCmt?.length && (
            <Col span={24}>
              <div className="flex items-center gap-x-3  w-full">
                <div className="w-[50px] h-[50px]">
                  <Image
                    preview={false}
                    className="rounded-full"
                    src={user?.image}
                    fallback={ErrorImage}
                    width={50}
                    height={50}
                  />
                </div>
                <Input
                  placeholder="Nhập bình luận..."
                  allowClear
                  value={newCmtContent}
                  onPressEnter={addComment}
                  onChange={(e) => {
                    setNewCmtContent(e.target.value);
                  }}
                />
                <SendOne
                  role="button"
                  theme="outline"
                  size="30"
                  fill="#DDB850"
                  onClick={addComment}
                />
                <Upload
                  role="button"
                  multiple={true}
                  showUploadList={false}
                  beforeUpload={() => false}
                  accept=".jpg,.jepg,.png,.svg,.bmp"
                  onChange={handleUploadImages}
                >
                  <UploadPicture theme="outline" size="30" fill="#DDB850" />
                </Upload>
              </div>
            </Col>
          )}
        </Row>
      </Spin>
    </BaseModal>
  );
};
