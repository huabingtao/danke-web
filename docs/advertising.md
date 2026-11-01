# 广告位配置

修改 lib/ad-config.ts 的 AD_CONFIG。home-between-sections 位于首页工具与资料之间，page-bottom 位于内页内容与页脚之间。

广告默认关闭。启用时设置 enabled: true、imageSrc（public 内的本地图片路径）、href 和 alt。缺少素材或跳转地址时不显示，不留空白。图片区域在手机固定为 100px 高，桌面为 90px 高，使用完整展示模式。建议根据横幅比例准备素材；跳转链接打开新窗口并标记为推广链接。

当前无需广告平台账号或数据库配置，也未加载广告平台脚本。
