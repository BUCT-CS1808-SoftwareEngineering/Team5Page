import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-layout';

export default () => {
  const defaultMessage = "计科1808出品";
  return (
    <DefaultFooter
      copyright={`2020 ${defaultMessage}`}
      links={[
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/BUCT-CS1808-SoftwareEngineering/Team5Page',
          blankTarget: true,
        }
      ]}
    />
  );
};
