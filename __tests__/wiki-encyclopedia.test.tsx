import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import WikiEncyclopediaClient from '../components/WikiEncyclopediaClient';
import WikiCategoryPageClient from '../components/wiki/WikiCategoryPageClient';
import {
  LOCAL_WIKI_ENTRIES,
  LOCAL_HANDBOOK_GUIDES,
} from '../lib/local-wiki-data';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/items',
}));

describe('WikiEncyclopediaClient & WikiCategoryPageClient', () => {
  test('renders handbook series, categories, and filters collectibles with simplified labels & modal icons', () => {
    render(
      <WikiEncyclopediaClient
        initialEntries={LOCAL_WIKI_ENTRIES}
        handbookGuides={LOCAL_HANDBOOK_GUIDES}
      />,
    );

    // 1. Verify From Beginner to Master (从入门到入土) section
    expect(screen.getByText('从入门到入土 · 特工篇')).toBeInTheDocument();
    expect(screen.getByText('从入门到入土 · 装备篇')).toBeInTheDocument();

    // 2. Switch to Collectibles (收藏品) category
    const collectibleTab = screen.getByRole('button', { name: /收藏品/ });
    fireEvent.click(collectibleTab);

    // Verify removed filter buttons & texts
    expect(screen.queryByRole('button', { name: /6大必做/ })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /满星\+2000攻击/ })).not.toBeInTheDocument();
    expect(screen.queryByText(/词条特性筛选:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/按期数筛选:/)).not.toBeInTheDocument();
    expect(screen.queryByText('查看全量 Wiki 数据库')).not.toBeInTheDocument();

    // Verify middle tags are 传奇 and 史诗 instead of 传奇红藏 and 史诗金藏
    expect(screen.queryByText('传奇红藏')).not.toBeInTheDocument();
    expect(screen.queryByText('史诗金藏')).not.toBeInTheDocument();
    expect(screen.getAllByText('传奇').length).toBeGreaterThan(0);
    expect(screen.getAllByText('史诗').length).toBeGreaterThan(0);

    // 3. Click "暴击率" filter tag (previously "红3加暴击率") -> shows both Legendary and Epic
    const critRateFilter = screen.getByRole('button', { name: /^暴击率$/ });
    fireEvent.click(critRateFilter);

    expect(screen.getByText('远古智慧之书')).toBeInTheDocument();
    expect(screen.getByText('古老的医学书籍')).toBeInTheDocument();
    expect(screen.getByText('幸运护身符')).toBeInTheDocument();
    expect(screen.queryByText('人类基因图谱')).not.toBeInTheDocument();
    expect(screen.queryByText('黄金餐具')).not.toBeInTheDocument();

    // 4. Click card to open detail modal and verify key nodes only show 🌟 icon without text
    fireEvent.click(screen.getByText('幸运护身符'));
    expect(screen.getByText('详细信息')).toBeInTheDocument();
    expect(screen.queryByText(/关键节点/)).not.toBeInTheDocument();
    expect(screen.queryByText('查看养成消耗矩阵')).not.toBeInTheDocument();
    expect(screen.queryByText('阅读关联深度攻略')).not.toBeInTheDocument();
    expect(screen.getByText('黄1星')).toBeInTheDocument();
    expect(screen.getByText('黄3星')).toBeInTheDocument();
    expect(screen.getByText('红3星')).toBeInTheDocument();
    expect(screen.getAllByText('🌟').length).toBe(4);
  });

  test('renders standalone Agent category page with Sea Agents, stripped (满级效果), and top-right tags', () => {
    render(
      <WikiCategoryPageClient
        categoryKey="AGENT"
        initialEntries={LOCAL_WIKI_ENTRIES}
      />,
    );

    // 1. Verify SP / S / 普通 filter buttons exist
    const spBtn = screen.getByRole('button', { name: 'SP' });
    const sBtn = screen.getByRole('button', { name: 'S' });
    const normalBtn = screen.getByRole('button', { name: '普通' });
    expect(spBtn).toBeInTheDocument();
    expect(sBtn).toBeInTheDocument();
    expect(normalBtn).toBeInTheDocument();

    // 2. Verify stripped (满级效果) from all-hero buffs
    expect(screen.queryByText(/（满级效果）/)).not.toBeInTheDocument();
    expect(screen.getAllByText('全体特工暴击率+5%').length).toBeGreaterThan(0);

    // 3. Filter by 普通 -> verify 4 Sea Agents (海绵宝宝, 派大星, 章鱼哥, 珊迪) exist
    fireEvent.click(normalBtn);
    expect(screen.getByText('科萌')).toBeInTheDocument();
    expect(screen.getByText('海绵宝宝')).toBeInTheDocument();
    expect(screen.getByText('派大星')).toBeInTheDocument();
    expect(screen.getByText('章鱼哥')).toBeInTheDocument();
    expect(screen.getByText('珊迪')).toBeInTheDocument();
    expect(screen.queryByText('哪吒')).not.toBeInTheDocument();

    // 4. Filter by SP -> 哪吒 is shown, 海绵宝宝 is hidden
    fireEvent.click(spBtn);
    expect(screen.getByText('哪吒')).toBeInTheDocument();
    expect(screen.queryByText('海绵宝宝')).not.toBeInTheDocument();

    // 5. Filter by S -> 伊狑 is shown, 哪吒 is hidden
    fireEvent.click(sBtn);
    expect(screen.getByText('伊狑')).toBeInTheDocument();
    expect(screen.queryByText('哪吒')).not.toBeInTheDocument();
  });

  test('renders Equipment page with SS/S badges, 破坏者风衣, and 4-Tab circular detail modal', () => {
    render(
      <WikiCategoryPageClient
        categoryKey="EQUIPMENT"
        initialEntries={LOCAL_WIKI_ENTRIES}
      />,
    );

    // 1. Verify filter buttons have SS装备 and S装备, without '装备筛选:' label
    expect(screen.queryByText(/装备筛选:/)).not.toBeInTheDocument();
    const ssFilterBtn = screen.getByRole('button', { name: 'SS装备' });
    const sFilterBtn = screen.getByRole('button', { name: 'S装备' });
    expect(ssFilterBtn).toBeInTheDocument();
    expect(sFilterBtn).toBeInTheDocument();

    // 2. Verify 破坏者风衣 exists under S装备
    fireEvent.click(sFilterBtn);
    expect(screen.getByText('破坏者风衣')).toBeInTheDocument();
    expect(screen.queryByText('双绝枪')).not.toBeInTheDocument();

    // 3. Open S equipment modal (破坏者风衣) -> check 4 tabs
    fireEvent.click(screen.getByText('破坏者风衣'));
    expect(screen.getByText('品质技能')).toBeInTheDocument();

    // Click 混沌 tab
    const chaosTabBtn = screen.getByTitle('混沌融合');
    fireEvent.click(chaosTabBtn);
    expect(screen.getByText('混沌融合')).toBeInTheDocument();
    expect(screen.getByText('暂无混沌融合系统')).toBeInTheDocument();

    // Click 神炼 tab
    const refineTabBtn = screen.getByTitle('异星神炼');
    fireEvent.click(refineTabBtn);
    expect(screen.getByText('异星神炼')).toBeInTheDocument();
    expect(screen.getByText('暂无异星神炼系统')).toBeInTheDocument();

    // Close modal
    fireEvent.click(screen.getByText('关闭'));

    // 4. Filter SS equipment -> Click 双绝枪
    fireEvent.click(ssFilterBtn);
    const ssCard = screen.getByText('双绝枪');
    fireEvent.click(ssCard);

    // Quality skills tab active by default
    expect(screen.getByText('品质技能')).toBeInTheDocument();
    expect(screen.getByText(/创星：每发射/)).toBeInTheDocument();

    // Click 神铸 tab
    const godforgeTabBtn = screen.getByTitle('神铸属性');
    fireEvent.click(godforgeTabBtn);
    expect(screen.getByText('神铸属性')).toBeInTheDocument();
    expect(screen.getByText('永恒神铸1星')).toBeInTheDocument();
    expect(screen.getByText('破坏神铸1星')).toBeInTheDocument();

    // Click 混沌 tab -> SS has chaos fusion 1~10 stars
    fireEvent.click(screen.getByTitle('混沌融合'));
    expect(screen.getByText('混沌1星')).toBeInTheDocument();

    // Click 神炼 tab -> SS has alien refinement Lv.1~13
    fireEvent.click(screen.getByTitle('异星神炼'));
    expect(screen.getByText('神炼Lv.1')).toBeInTheDocument();
  });

  test('renders Pet category page with simplified 3 filters (excluding standalone skills), authentic dual-skill icons, and 2-tab detail modal', () => {
    render(
      <WikiCategoryPageClient
        categoryKey="PET"
        initialEntries={LOCAL_WIKI_ENTRIES}
      />,
    );

    // 1. Verify removed descriptions and filter prefix
    expect(screen.queryByText(/S宠物幽暗之灵、助战与异宠核心槽位/)).not.toBeInTheDocument();
    expect(screen.queryByText(/宠物模块筛选/)).not.toBeInTheDocument();

    // 2. Verify only 3 pet filter buttons exist (no standalone 助战技能 filter button)
    const allPetBtn = screen.getByRole('button', { name: '全部宠物' });
    const sPetBtn = screen.getByRole('button', { name: 'S级宠物' });
    const normalPetBtn = screen.getByRole('button', { name: '普通宠物' });
    expect(allPetBtn).toBeInTheDocument();
    expect(sPetBtn).toBeInTheDocument();
    expect(normalPetBtn).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '助战技能' })).not.toBeInTheDocument();

    // 3. Verify standalone support skill entries are NOT in the pet list
    expect(screen.queryByText('宠物技能 · 共鸣伤害')).not.toBeInTheDocument();
    expect(screen.queryByText('宠物技能 · 守护')).not.toBeInTheDocument();

    // 4. Filter by S级宠物 -> 幽暗之灵 and 加肥喵 shown, 皮皮德 and 老鹰 hidden
    fireEvent.click(sPetBtn);
    expect(screen.getByText('幽暗之灵')).toBeInTheDocument();
    expect(screen.getByText('加肥喵')).toBeInTheDocument();
    expect(screen.queryByText('皮皮德')).not.toBeInTheDocument();
    expect(screen.queryByText('老鹰')).not.toBeInTheDocument();

    // 5. Open 幽暗之灵 detail modal -> verify authentic innate skills & 2-tab switcher
    fireEvent.click(screen.getByText('幽暗之灵'));
    expect(screen.queryByText(/T0/)).not.toBeInTheDocument();
    expect(screen.getByText('幽暗律法：')).toBeInTheDocument();
    expect(screen.getByText('永夜冠冕：')).toBeInTheDocument();
    expect(screen.getByText('黄1星')).toBeInTheDocument();
    expect(screen.getByText('黄4星')).toBeInTheDocument();
    expect(screen.getByText('红5星')).toBeInTheDocument();

    // Verify Tab 2 (异宠助战与洗练池)
    const supportTabBtn = screen.getByTitle('助战与技能池');
    fireEvent.click(supportTabBtn);
    expect(screen.getByText(/异宠洗练池说明/)).toBeInTheDocument();
    expect(screen.getByText('守护')).toBeInTheDocument();
    expect(screen.getByText('寒霜')).toBeInTheDocument();
    expect(screen.getByText('共鸣·增幅')).toBeInTheDocument();
    fireEvent.click(screen.getByText('关闭'));

    // 6. Filter by 普通宠物 -> 皮皮德 and 老鹰 shown, 幽暗之灵 hidden
    fireEvent.click(normalPetBtn);
    expect(screen.getByText('皮皮德')).toBeInTheDocument();
    expect(screen.getByText('老鹰')).toBeInTheDocument();
    expect(screen.queryByText('幽暗之灵')).not.toBeInTheDocument();

    // 7. Open 皮皮德 detail modal -> verify 普通 skills & Tab 2 support/passive pool
    fireEvent.click(screen.getByText('皮皮德'));
    expect(screen.getByText('噪音攻击：')).toBeInTheDocument();
    expect(screen.getByText('激励吼叫：')).toBeInTheDocument();
    expect(screen.getByText('黄1星')).toBeInTheDocument();

    // Verify Tab 2 for normal pet
    fireEvent.click(screen.getByTitle('助战与技能池'));
    expect(screen.getByText(/助战特技/)).toBeInTheDocument();
    expect(screen.getByText('强壮')).toBeInTheDocument();
    expect(screen.getByText('强力')).toBeInTheDocument();
    expect(screen.getByText(/专属出战被动/)).toBeInTheDocument();
    expect(screen.getByText('激励')).toBeInTheDocument();
    expect(screen.getByText('超级同仇敌忾')).toBeInTheDocument();
  });

  test('verifies cards across remaining categories have no "查看节点 →" or tier tags', () => {
    const { unmount } = render(
      <WikiCategoryPageClient
        categoryKey="TECH_PART"
        initialEntries={LOCAL_WIKI_ENTRIES}
      />,
    );
    expect(screen.queryByText(/查看节点/)).not.toBeInTheDocument();
    expect(screen.queryByText(/T0/)).not.toBeInTheDocument();
    expect(screen.queryByText(/T1/)).not.toBeInTheDocument();
    unmount();

    render(
      <WikiCategoryPageClient
        categoryKey="MOUNT"
        initialEntries={LOCAL_WIKI_ENTRIES}
      />,
    );
    expect(screen.queryByText(/查看节点/)).not.toBeInTheDocument();
    expect(screen.queryByText(/T0/)).not.toBeInTheDocument();
  });

  test('verifies TECH_PART has no description subtitle, no top-right badge, authentic damage tags, and 3-tab detail modal', () => {
    render(
      <WikiCategoryPageClient
        categoryKey="TECH_PART"
        initialEntries={LOCAL_WIKI_ENTRIES}
      />,
    );

    // 1. Verify subtitle "双生配件谐振与超频共鸣机制" is removed
    expect(screen.queryByText('双生配件谐振与超频共鸣机制')).not.toBeInTheDocument();

    // 2. Verify top-right badges (SS) and old tags (No.1必做, 双生配件) are completely removed
    expect(screen.queryByText('No.1必做')).not.toBeInTheDocument();
    expect(screen.queryByText('双生配件')).not.toBeInTheDocument();

    // 3. Verify real damage tags appear on drone card: 衰弱, 易伤, 裂伤
    expect(screen.getByText('双生无人机')).toBeInTheDocument();
    expect(screen.getAllByText('衰弱').length).toBeGreaterThan(0);
    expect(screen.getAllByText('易伤').length).toBeGreaterThan(0);
    expect(screen.getAllByText('裂伤').length).toBeGreaterThan(0);

    // 4. Open 双生无人机 detail modal
    fireEvent.click(screen.getByText('双生无人机'));

    // Top status bar with authentic base stats: 攻击 6500, 生命 26000, 配件类型 双生
    expect(screen.getByText('6500')).toBeInTheDocument();
    expect(screen.getByText('26000')).toBeInTheDocument();
    expect(screen.getByText('双生')).toBeInTheDocument();

    // Verify Tab 1 (品质技能) is shown by default with 5 authentic quality tiers
    expect(screen.getByText('品质技能')).toBeInTheDocument();
    expect(screen.getByText('精良')).toBeInTheDocument();
    expect(screen.getByText('优秀')).toBeInTheDocument();
    expect(screen.getByText('史诗')).toBeInTheDocument();
    expect(screen.getByText('传奇')).toBeInTheDocument();
    expect(screen.getByText('永恒')).toBeInTheDocument();
    expect(screen.getByText(/局内无人机技能变为双生无人机/)).toBeInTheDocument();

    // 5. Switch to Tab 2 (谐振) -> Verify 54 grades
    const harmonyBtn = screen.getByTitle('谐振');
    fireEvent.click(harmonyBtn);
    expect(screen.getByText(/谐振属性 \(共54阶\)/)).toBeInTheDocument();
    expect(screen.getByText(/第1阶\s+\(/)).toBeInTheDocument();
    expect(screen.getByText(/第54阶\s+\(/)).toBeInTheDocument();

    // 6. Switch to Tab 3 (过载) -> Verify 18 levels
    const overloadBtn = screen.getByTitle('过载');
    fireEvent.click(overloadBtn);
    expect(screen.getByText(/过载属性 \(共18级\)/)).toBeInTheDocument();
    expect(screen.getByText(/Lv\.1\s+\(/)).toBeInTheDocument();
    expect(screen.getByText(/Lv\.18\s+\(/)).toBeInTheDocument();

    // 7. Verify modal bottom tags inherit damage tags
    expect(screen.getAllByText('衰弱').length).toBeGreaterThan(0);
    expect(screen.getAllByText('易伤').length).toBeGreaterThan(0);
    expect(screen.getAllByText('裂伤').length).toBeGreaterThan(0);

    // Close modal
    fireEvent.click(screen.getByText('关闭'));
  });

  test('verifies MOUNT category has no description subtitle, no top-right badge, authentic damage tags, official summary, 1-8 line milestones without acquisition', () => {
    render(
      <WikiCategoryPageClient
        categoryKey="MOUNT"
        initialEntries={LOCAL_WIKI_ENTRIES}
      />,
    );

    // 1. Verify subtitle is removed
    expect(screen.queryByText('战术坐骑品质、共振加成与移动机制')).not.toBeInTheDocument();

    // 2. Verify normalized name (no 幽焰逐影（幽灵狼）) and all 4 mounts are rendered
    expect(screen.getByText('幽焰逐影')).toBeInTheDocument();
    expect(screen.queryByText('幽焰逐影（幽灵狼）')).not.toBeInTheDocument();
    expect(screen.getByText('末世战马')).toBeInTheDocument();
    expect(screen.getByText('科技滑板')).toBeInTheDocument();
    expect(screen.getByText('电动平衡车')).toBeInTheDocument();

    // 3. Verify card bottom tags contain authentic damage attributes
    expect(screen.getAllByText('冰缓').length).toBeGreaterThan(0);
    expect(screen.getAllByText('技能伤害').length).toBeGreaterThan(0);
    expect(screen.getAllByText('首领伤害').length).toBeGreaterThan(0);
    expect(screen.getAllByText('护盾增伤').length).toBeGreaterThan(0);
    expect(screen.getAllByText('毒伤').length).toBeGreaterThan(0);
    expect(screen.getAllByText('裂伤').length).toBeGreaterThan(0);
    expect(screen.getAllByText('衰弱').length).toBeGreaterThan(0);
    expect(screen.getAllByText('暴击伤害').length).toBeGreaterThan(0);

    // 4. Open 幽焰逐影 detail modal
    fireEvent.click(screen.getByText('幽焰逐影'));

    // Verify official summary from unpack
    expect(screen.getByText('灾变降临后诞生的特殊实验体，身披幽焰，影随魂行')).toBeInTheDocument();

    // Verify milestones 1-8
    expect(screen.getByText('填满1条横线之后激活')).toBeInTheDocument();
    expect(screen.getByText('填满8条横线之后激活')).toBeInTheDocument();
    expect(screen.getAllByText(/对冰缓目标伤害/).length).toBeGreaterThan(0);
    expect(screen.getByText(/灵魂收割：幽魂领域和幽焰爆炸/)).toBeInTheDocument();
    expect(screen.getByText(/触发幽焰爆炸时，护盾增伤/)).toBeInTheDocument();
    expect(screen.getAllByText('+30%').length).toBeGreaterThan(0);
    expect(screen.getAllByText('+120%').length).toBeGreaterThan(0);

    // Verify modal bottom tags inherit damage attributes
    expect(screen.getAllByText('冰缓').length).toBeGreaterThan(0);
    expect(screen.getAllByText('技能伤害').length).toBeGreaterThan(0);
    expect(screen.getAllByText('首领伤害').length).toBeGreaterThan(0);
    expect(screen.getAllByText('护盾增伤').length).toBeGreaterThan(0);

    // Verify acquisition section is completely gone
    expect(screen.queryByText(/获取途径/)).not.toBeInTheDocument();

    // Close modal
    fireEvent.click(screen.getByText('关闭'));
  });

  test('verifies BUFF category has battle status icons, and MECHANIC category has authentic consumables with subcategory filters & cleaned modal', () => {
    // 1. Render BUFF standalone page
    const { unmount } = render(
      <WikiCategoryPageClient
        categoryKey="BUFF"
        initialEntries={LOCAL_WIKI_ENTRIES}
      />,
    );

    // Verify battle buffs exist under BUFF
    expect(screen.getByText('战斗状态 · 神火')).toBeInTheDocument();
    expect(screen.getByText('战斗状态 · 裂伤')).toBeInTheDocument();
    expect(screen.getByText('战斗状态 · 冰缓')).toBeInTheDocument();
    expect(screen.queryByText('神器核心')).not.toBeInTheDocument();
    unmount();

    // 2. Render MECHANIC standalone page
    render(
      <WikiCategoryPageClient
        categoryKey="MECHANIC"
        initialEntries={LOCAL_WIKI_ENTRIES}
      />,
    );

    // Verify battle buffs are NOT in MECHANIC
    expect(screen.queryByText('战斗状态 · 神火')).not.toBeInTheDocument();
    expect(screen.queryByText('战斗状态 · 裂伤')).not.toBeInTheDocument();

    // Verify subcategory filter buttons exist
    const keyFilterBtn = screen.getByRole('button', { name: '钥匙' });
    const coreFilterBtn = screen.getByRole('button', { name: '核心' });
    const boxFilterBtn = screen.getByRole('button', { name: '宝箱' });
    const fragFilterBtn = screen.getByRole('button', { name: '碎片' });
    const printFilterBtn = screen.getByRole('button', { name: '图纸' });
    const matFilterBtn = screen.getByRole('button', { name: '材料' });
    expect(keyFilterBtn).toBeInTheDocument();
    expect(coreFilterBtn).toBeInTheDocument();
    expect(boxFilterBtn).toBeInTheDocument();
    expect(fragFilterBtn).toBeInTheDocument();
    expect(printFilterBtn).toBeInTheDocument();
    expect(matFilterBtn).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '石头' })).not.toBeInTheDocument();

    // Filter by 钥匙 -> S级军备钥匙 shown, 神器核心 hidden
    fireEvent.click(keyFilterBtn);
    expect(screen.getByText('S级军备钥匙')).toBeInTheDocument();
    expect(screen.getByText('高级钥匙')).toBeInTheDocument();
    expect(screen.queryByText('神器核心')).not.toBeInTheDocument();

    // Filter by 核心 -> 神器核心 shown, S级军备钥匙 hidden
    fireEvent.click(coreFilterBtn);
    expect(screen.getByText('神器核心')).toBeInTheDocument();
    expect(screen.queryByText('S级军备钥匙')).not.toBeInTheDocument();

    // Open 神器核心 detail modal
    fireEvent.click(screen.getByText('神器核心'));

    // Verify badge above title (核心养成通货) is removed
    expect(screen.queryByText('核心养成通货')).not.toBeInTheDocument();

    // Verify official authentic summary description from Item.csv
    expect(screen.getByText('可用于SS神器神铸的核心材料')).toBeInTheDocument();

    // Verify 详细信息 (milestones) section is removed
    expect(screen.queryByText('详细信息')).not.toBeInTheDocument();

    // Verify bottom tag is the actual category tag '核心'
    const modalTag = screen.getAllByText('核心');
    expect(modalTag.length).toBeGreaterThan(0);

    // Close modal
    fireEvent.click(screen.getByText('关闭'));
  });
});
