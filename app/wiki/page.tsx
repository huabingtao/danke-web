import type { Metadata } from 'next';
import WikiHubClient from '@/components/WikiHubClient';

export const metadata: Metadata = {
  title: '战术百科图鉴与词条字典 | 弹壳特攻队工具箱',
  description: '查询《弹壳特攻队》特工星级与觉醒属性、全期收藏品加暴伤暴击词条、载具品质与共振加成。',
  keywords: '弹壳特攻队图鉴, 特工词条, 收藏品加暴伤, 弹壳载具, 伏尔甘词条, 844阵容, 543特工, 弹壳呱呱',
};

export default function WikiPage() {
  return <WikiHubClient />;
}
