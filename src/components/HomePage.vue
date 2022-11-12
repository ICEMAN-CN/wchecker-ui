<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <div class="header">
          <img id="logo" class="logo" alt="Wchecker logo" src="../assets/wchecker_logo.png">
        </div>
      </el-header>
      <el-main style="padding: 0">
        <div id="main">
          <div class="remark">
            <el-row>使用Wchecker润色您的英文文档</el-row>
          </div>
          <div class="description">
            上传doc、docx、txt文件，获取语法、标点、拼写、风格、词汇等全方位书写建议<br>
            Wchecker通过对照数百万篇已发表论文给出专业建议，马上费试用！
          </div>
          <div class="upload">
            <el-upload
                class="upload-demo"
                :auto-upload="false"
                :limit="1"
                :on-exceed="handleExceed"
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            >
              <el-button v-if="isShowSelectFile" type="primary">选择文件</el-button>
              <el-button v-if="beginCheck" type="primary" @click="submitUpload">开始检查</el-button>
              <el-button v-if="checkSuccess" type="success" @click="submitUpload">下载文件</el-button>
              <el-button v-if="checkFail" type="warning" @click="submitUpload">重新检查</el-button>
              <template v-if="isShowSelectFile" #tip>
                <div class="el-upload__tip">
                  支持txt、docx、docx类型文件，文件大小不超过50Mb
                </div>
              </template>
            </el-upload>
          </div>
        </div>
      </el-main>
      <el-footer>
        <div class="footer">
          <div id="copyright">2022 ©ICEMAN - 冀ICP备20004026号<br></div>
          <div id="info">
            <div id="website">
              <a target="_blank" href="http://wchecker.cn">wchecker.cn</a>
            </div>&nbsp;·&nbsp;
            <div id="help">
              <a target="_blank" href="mailto:yfly1992@163.com">yfly1992@163.com</a>
            </div>&nbsp;·&nbsp;
            <div id="Github">
              <a target="_blank" href="https://github.com/ICEMAN-CN">Github</a>
            </div>&nbsp;&nbsp;
          </div>
        </div>
      </el-footer>
    </el-container>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { genFileId } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus'

const upload = ref<UploadInstance>()

const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}

const submitUpload = () => {
  upload.value!.submit()
}
</script>
<script>
export default {
  name: "HomePage",
  data() {
    return {
      isShowSelectFile: true,
      beginCheck: false,
      checking: false,
      checkFail: false,
      checkSuccess: false,
    }
  },
  mounted() {
    // this.startLoading();
  },

  methods: {

    startLoading() {
      const loading = this.$loading({
        lock: true,
        text: "请勿关闭页面，文档检查中...",
        background: "rgba(0, 0, 0, 0.7)"
      });
      return loading;
    },
    endLoading(loading) {
      loading.close();
    },
    submitUpload() {

    }
  }
}
</script>

<style scoped>
.header {
  position: fixed;
  height: 60px;
  width: 100%;
  right: 0;
  top: 0;
  z-index: 999;
  background-color: white;
  box-shadow: 2px 2px 2px #888888;
}

.logo {
  float: left;
  height: 60px;
  width: 170px;
}

.footer {
  display: block;
  height: 60px;
  line-height: 20px;
  margin-top: 50px;
}

#copyright, #info {
  margin-top: 5px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: flex-end;
}

#main {
  margin-left: 15%;
  text-align: center;
  width: 70%;
  height: 700px;
  padding: 0;
  display: flex;
  justify-content: center;
  background-color: white;
  box-shadow: 1px 1px 1px #888888;
  flex-flow: column nowrap;
  align-items: center;
}

.remark {
  height: 100px;
  font-size: 30px;
  color: rgb(24, 39, 215);
}

.description {
  line-height: 30px;
  font-size: 16px;
  color: #888
}
.upload {
  margin-top: 30px;
  height: 300px;
}
.el-upload-list__item-info {
  align-items: center;
}
</style>
