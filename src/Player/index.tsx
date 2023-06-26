/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useEffect } from "react";
import XGPlayer, { Events, IPlayerOptions } from "xgplayer";
import FlvPlugin from "xgplayer-flv";
import Mp4Plugin from "xgplayer-mp4";
import "./index.less?inline";
import HlsJsPlugin from "xgplayer-hls.js";
import "xgplayer/dist/index.min.css";
import { urlSuffix } from "@/utils/utils";

interface PlayerProps {
  option?: IPlayerOptions;
  /** 源 */
  origins: {
    name: string;
    definition: string;
    url: string;
  }[];
  /** 流切换 */
  onDefinitionChange?: (data: any) => any;
  /** 播放器插件  */
  extraPlugins?: {
    /** 插件的类  */
    plugin: any;
    /** 插件的配置  */
    options: any;
  }[];
  /** 播放器初始化完成 */
  afterPlayerInit?: (player: XGPlayer) => any;
}

export type PlayerRef = {
  instance: XGPlayer | null;
};

const Player: FC<PlayerProps> = React.memo(
  ({
    option = {},
    origins,
    onDefinitionChange,
    extraPlugins = [],
    afterPlayerInit,
  }) => {
    const [instance, setInstance] = React.useState<XGPlayer | null>(null);
    console.log("播放器重刷!");
    useEffect(() => {
      if (instance != null) {
        // 先销毁
        try {
          instance.pause();
          instance.destroy();
          setInstance(null);
        } catch (err) {
          console.log("注销失败！" + err);
        }
      }
      if (origins && origins.length > 0) {
        const suffix = urlSuffix(origins[0].url) as keyof typeof map;
        const map = {
          m3u8: HlsJsPlugin,
          flv: FlvPlugin,
          mp4: Mp4Plugin,
        };
        const playerPlugins = map[suffix] ? [map[suffix]] : [];
        const plugins = [...playerPlugins];
        console.log(
          "%c [ plugins ]-67",
          "font-size:13px; background:pink; color:#bf2c9f;",
          plugins
        );
        const player = new XGPlayer({
          el: document.querySelector("#video") as HTMLElement,
          // isLive: true,
          playsinline: true,
          url: origins[0].url,
          autoplay: true,
          autoplayMuted: true,
          lang: "zh-cn",
          pip: true,
          fluid: true,
          //@ts-ignore 官方类型错误
          playbackRate: false,
          cssFullscreen: false,
          screenShot: {
            saveImg: true,
            quality: 0.92,
            type: "image/png",
            format: ".png",
          },
          plugins,
          // flv: {
          //   retryCount: 3, // 重试 3 次，默认值
          //   retryDelay: 1000, // 每次重试间隔 1 秒，默认值
          //   loadTimeout: 10000, // 请求超时时间为 10 秒，默认值
          //   fetchOptions: {
          //     // 该参数会透传给 fetch，默认值为 undefined
          //     mode: "cors",
          //   },
          // },
          // hls: {
          //   retryCount: 3, // 重试 3 次，默认值
          //   retryDelay: 1000, // 每次重试间隔 1 秒，默认值
          //   loadTimeout: 10000, // 请求超时时间为 10 秒，默认值
          //   fetchOptions: {
          //     // 该参数会透传给 fetch，默认值为 undefined
          //     mode: "cors",
          //   },
          //   targetLatency: 10, // 直播目标延迟，默认 10 秒
          //   maxLatency: 20, // 直播允许的最大延迟，默认 20 秒
          //   disconnectTime: 0, // 直播断流时间，默认 0 秒，（独立使用时等于 maxLatency）
          // },
          // hlsJsPlugin: {
          //   fixAudioTimestampGap: false, //填充静默音频帧以避免检测大音频时间戳间隙时A /
          //   enableWorker: true, // 是否多线程工作
          //   enableStashBuffer: true, //启用IO Stash缓冲区。 如果您需要实时（最小延迟），则设置为false，但如果有网络抖动可能会停止
          //   stashInitialSize: 10240, // 缓存大小(kb)  默认384kb 128kb
          //   reuseRedirectedURL: true, //重用301/302重定向url，用于随后的请求，如查找、重新连接等。
          //   autoCleanupSourceBuffer: false, //自动清除缓存
          //   lazyLoad: false, //如果有足够的数据用于播放，则中止 http 连接
          //   deferLoadAfterSourceOpen: false, //在MediaSource sourceopen事件触发后加载。在Chrome上，在后台打开的标签页可能不会触发sourceopen事件，除非切换到该标签页。
          // },
          ...option,
        });

        // 注册播放器插件
        try {
          extraPlugins?.forEach(({ plugin, options }) => {
            player.registerPlugin(plugin, options);
          });
        } catch (error) {
          console.error("注册播放器插件失败!", error);
        }
        // 调用hook
        afterPlayerInit?.(player);
        player.on(Events.ERROR, (e) => {
          console.log("播放器抛出错误!");
          console.error(e);
        });
        player.on(Events.USER_ACTION, (data) => {
          const map = new Proxy(
            {
              change_definition() {
                onDefinitionChange?.(data);
              },
            },
            {
              get(target, p, receiver) {
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                return target[p as keyof typeof target] ?? function () {};
              },
            }
          );
          const action = data?.action as keyof typeof map;
          map?.[action]?.();
        });
        setInstance(player);
        player.emit("resourceReady", origins);
      }

      return () => {
        instance?.destroy();
        setInstance(null);
      };
    }, [origins]);

    return <div id="video"></div>;
  },
  (prev, next) => prev.origins === next.origins
);

export default Player;
