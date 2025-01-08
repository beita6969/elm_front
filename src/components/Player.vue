<template>
  <div class="hello-ezuikit-js">
    <div id="video-container" class="video-container"></div>
    <div class="control-buttons">
      <button @click="stop" class="control-btn" title="停止">
        <el-icon><VideoPause /></el-icon>
      </button>
      <button @click="play" class="control-btn" title="开始">
        <el-icon><VideoPlay /></el-icon>
      </button>
      <button @click="capturePicture" class="control-btn" title="拍照">
        <el-icon><Camera /></el-icon>
      </button>
    </div>
  </div>
</template>

<script setup>
import EZUIKit from "ezuikit-js";
import { onMounted, ref, onBeforeUnmount } from "vue";
import request from '@/api/config'
import { showError, showSuccess } from '@/utils/message'
import { VideoPlay, VideoPause, Camera } from '@element-plus/icons-vue'

const deviceSerial = 'L29334649'  // 设备序列号
const channelNo = 1  // 通道号

let player;
const isPlaying = ref(false)
const isLoading = ref(false)

const emit = defineEmits(['capture-success'])

const play = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  
  try {
    await startStream(deviceSerial, channelNo);
    const playPromise = player.play();
    await playPromise;
    isPlaying.value = true;
    showSuccess('播放成功');
  } catch (error) {
    console.error('播放失败:', error);
    showError('播放失败，请重试');
  } finally {
    isLoading.value = false;
  }
};

const stop = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  
  try {
    await stopStream(deviceSerial, channelNo);
    const stopPromise = player.stop();
    await stopPromise;
    isPlaying.value = false;
    showSuccess('停止成功');
  } catch (error) {
    console.error('停止失败:', error);
    showError('停止失败，请重试');
  } finally {
    isLoading.value = false;
  }
};

const capturePicture = async () => {
  if (isLoading.value || !isPlaying.value) {
    showError('请在视频播放时进行抓拍');
    return;
  }
  
  isLoading.value = true;
  try {
    const accessToken = await getToken();
    const response = await capturePicture({
      accessToken,
      deviceSerial,
      channelNo,
      quality: 1
    });
    
    if (response && response.picUrl) {
      showSuccess(`照片已成功保存至: ${response.localPath}`);
      emit('capture-success', {
        picUrl: response.picUrl,
        localPath: response.localPath,
        time: response.time || new Date().toLocaleString()
      });
    } else {
      throw new Error('抓拍失败: 未获取到图片URL');
    }
  } catch (error) {
    console.error('抓拍失败:', error);
    showError('抓拍失败，请重试');
  } finally {
    isLoading.value = false;
  }
};

const getToken = async () => {
  try {
    const storedToken = localStorage.getItem('ys_token');
    const storedExpireTime = localStorage.getItem('ys_token_expire');
    
    if (storedToken && storedExpireTime && Date.now() < parseInt(storedExpireTime)) {
      return storedToken;
    }

    const response = await request.get('/api/ys/token');
    if (!response || !response.accessToken) {
      throw new Error('获取token失败：服务器响应异常');
    }
    
    const { accessToken, expireTime } = response;
    localStorage.setItem('ys_token', accessToken);
    localStorage.setItem('ys_token_expire', expireTime);
    
    return accessToken;
  } catch (error) {
    console.error('获取token失败:', error);
    showError('获取视频授权失败，请刷新页面重试');
    throw error;
  }
};

const handleError = async (err) => {
  console.error("播放器错误:", err);
  if (err.code === "10002" || err.code === 401) {
    localStorage.removeItem('ys_token');
    localStorage.removeItem('ys_token_expire');
    isPlaying.value = false;
    
    try {
      await init();
      showSuccess('已重新连接视频流');
      isPlaying.value = true;
    } catch (error) {
      console.error('重新初始化失败:', error);
      showError('视频重连失败，请刷新页面重试');
    }
  }
}

const init = async () => {
  if (player) {
    destroy();
  }
  
  const container = document.getElementById('video-container');
  if (!container) {
    console.error('未找到视频容器');
    return;
  }
  
  try {
    const accessToken = await getToken();
    
    player = new EZUIKit.EZUIKitPlayer({
      id: "video-container",
      accessToken,
      url: `ezopen://open.ys7.com/${deviceSerial}/${channelNo}.hd.live`,
      template: "simple",
      plugin: ["talk"],
      autoplay: true,
      handleError,
      env: {
        domain: "https://open.ys7.com"
      }
    });
    
    window.player = player;
    isPlaying.value = true;
  } catch (error) {
    console.error('播放器初始化失败:', error);
    showError('播放器初始化失败，请刷新页面重试');
  }
};

const destroy = () => {
  try {
    if (player) {
      player.destroy();
      player = null;
      isPlaying.value = false;
    }
  } catch (error) {
    console.error('销毁播放器失败:', error);
  }
};

onMounted(() => {
  setTimeout(() => {
    init();
  }, 100);
});

// 组件销毁时清理播放器
onBeforeUnmount(() => {
  destroy();
});
</script>

<style scoped>
.hello-ezuikit-js {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.video-container {
  flex: 1;
  min-height: 300px;
}

:deep(.hello-ezuikit-js) {
  width: 100%;
  height: 100%;
}

#video-container {
  width: 100% !important;
  height: 100% !important;
  display: flex;
}

.control-buttons {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  gap: 15px;
  background: rgba(26, 42, 108, 0.4);
  padding: 8px;
  border-radius: 4px;
  border: 1px solid rgba(0, 224, 145, 0.2);
  z-index: 10;
}

.video-content {
  position: relative;
}

.control-btn {
  width: 32px;
  height: 32px;
  background: rgba(0, 224, 145, 0.1);
  border: 1px solid rgba(0, 224, 145, 0.3);
  color: #fff;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-btn:hover {
  background: rgba(0, 224, 145, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 224, 145, 0.3);
}

.control-btn:active {
  transform: scale(0.98);
}

.control-btn .el-icon {
  font-size: 16px;
  color: #00e091;
}

/* 图标悬停效果 */
.control-btn:hover .el-icon {
  color: #fff;
  transform: scale(1.1);
}

/* 添加按钮组容器的阴影效果 */
.control-buttons {
  box-shadow: inset 0 0 15px rgba(0, 224, 145, 0.1);
}
</style>
