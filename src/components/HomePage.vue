<template>
  <div class="homePage">
    <el-container>
      <el-header>
        <div class="header">
          <img id="logo" class="logo" alt="Wchecker logo" src="../assets/image/wchecker_logo.png">
        </div>
      </el-header>
      <el-main style="padding: 0">
        <div id="main">
          <div class="remark" id="remark">
            <el-row>使用Wchecker润色您的英文文档</el-row>
          </div>
          <div class="description" id="description">
            上传doc、docx、txt文件，获取语法、标点、拼写、风格、词汇等全方位书写建议<br>
            Wchecker通过对照数百万篇已发表论文给出专业建议，免费使用！
          </div>
          <div class="loading" v-if="isChecking">Load&nbsp;ng</div>
          <div class="upload">
            <el-upload
                v-if="!isChecking"
                class="upload-demo"
                drag
                ref="upload"
                action="http://www.wchecker.cn/api/wchecker/proofread/upload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="handleUploadSuccess"
                :on-error="handleUploadFail"
                :before-upload="handleBeforeUpload"
                :file-list="fileList"
                :on-change="onChange">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">拖动文件到此处，或<em>点击上传</em>开始校验文档</div>
              <div class="el-upload__tip" slot="tip">支持txt、docx、docx类型文件，文件大小不超过50Mb</div>
              <!--              <el-button v-if="isShowSelectFile" slot="trigger" type="primary">选取文件</el-button>-->
              <!--              <el-button v-if="beginCheck" style="margin-left: 10px;" size="small" type="success" @click="submitUpload">-->
              <!--                开始检查-->
              <!--              </el-button>-->
              <!--              <div v-if="isShowSelectFile" slot="tip" class="el-upload__tip">-->
              <!--                支持txt、docx、docx类型文件，文件大小不超过50Mb-->
              <!--              </div>-->
              <!--              <el-button v-if="checkSuccess" type="success" @click="submitUpload">下载文件</el-button>-->
              <!--              <el-button v-if="checkFail" type="warning" @click="submitUpload">重新检查</el-button>-->
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
<script>
import ajax from "@/assets/js/axios.config";

export default {
  name: "HomePage",
  data() {
    return {
      isShowSelectFile: true,
      checking: false,
      checkFail: false,
      checkSuccess: false,
      isLoading: false,
      isChecking: false,
      fileList: [],
      jobId: 0,
      jobName: '',
      timer: null
    }
  },
  mounted() {
  },

  methods: {
    startCheckStatus(jobId) {
      this.timer = window.setInterval(() => {
        setTimeout(() => {
          this.getCheckStatus(jobId);
        }, 1)
      }, 5000);
    },
    destroyed() {
      clearInterval(this.timer)
    },
    downloadResultFile(jobId) {
      var elemIF = document.createElement('a');
      elemIF.href = `http://www.wchecker.cn/api/wchecker/proofread/download/${jobId}`;
      elemIF.download = this.jobName;
      elemIF.style.display = 'none';
      document.body.appendChild(elemIF);
      elemIF.click();
      document.body.removeChild(elemIF);
      this.downloadSuccessEndCheck();
      this.$message({
        message: '文件校验成功，结果文件下载成功，欢迎再次使用',
        type: 'success'
      });
      // this.$ajax
      //     .get("/api/wchecker/proofread/download/" + jobId)
      //     .then(response => {
      //       console.log(response);
      //       if (response.code === 1003) {
      //         this.destroyed();
      //         this.$message({
      //           message: '文件不存在，无法下载',
      //           type: 'error'
      //         });
      //       } else if (response.code === 1006) {
      //         this.destroyed();
      //         this.$message({
      //           message: '文件校验失败',
      //           type: 'error'
      //         });
      //       } else if (response.code === 1007) {
      //         this.destroyed();
      //         this.$message({
      //           message: '文件下载失败',
      //           type: 'error'
      //         });
      //       } else {
      //
      //       }
      //     });
    },
    getCheckStatus(jobId) {
      this.$ajax
          .get("/api/wchecker/proofread/status/" + jobId)
          .then(response => {
            console.log(response);
            if (response.code === 0 && response.data === '校对中') {
              console.log("文档校对中...")
            } else if (response.code === 1003) {
              this.destroyed();
              this.$message({
                message: '任务不存在',
                type: 'warning'
              });
              this.errorEndCheck();
            } else if (response.code === 0 && response.data === '校对失败') {
              this.destroyed();
              this.$message({
                message: '校对失败',
                type: 'error'
              });
              this.errorEndCheck();
            } else if (response.code === 0 && response.data === '校对成功') {
              this.destroyed();
              this.successEndCheck();
              this.downloadResultFile(this.jobId);
            }
          });
    },
    handleBeforeUpload(file) {
      // 限制上传文件大小 50m
      // console.log("file.size / 1024 / 1024 > 50")
      // console.log(file.size)
      // console.log(file.size / 1024 / 1024 > 50)
      if (file.size / 1024 / 1024 > 50) {
        this.$message({
          message: '请控制文件大小在50Mb之内',
          type: 'error'
        });
        this.errorEndCheck();
        return false;
      }
      // 限制上传文件类型
      let fileName = file.name;
      let pos = fileName.lastIndexOf(".");
      let lastName = fileName.substring(pos, fileName.length);
      if (
          lastName.toLowerCase() !== ".doc" &&
          lastName.toLowerCase() !== ".docx"&&
          lastName.toLowerCase() !== ".txt"
      ) {
        this.$message({
          message: '文件必须为doc、docx、txt类型，暂不支持其他类型文件',
          type: 'error'
        });
        this.errorEndCheck();
        return false;
      }
      return true;
    },
    handleUploadSuccess(response, file) {
      this.beginCheck();
      console.log("response")
      console.log(response)
      if (response.code !== 0 || response.data === null) {
        if (response.code === 1001) {
          this.$message({
            message: '文件上传失败，文件类型不支持',
            type: 'warning'
          });
          this.errorEndCheck();
        } else if (response.code === 1002) {
          this.$message({
            message: '文件上传失败，未知异常',
            type: 'warning'
          });
          this.errorEndCheck();
        } else {
          this.$message({
            message: '上传失败，请稍后重试',
            type: 'warning'
          });
          this.errorEndCheck();
        }
      } else {
        this.jobId = response.data.job_id;
        this.jobName = response.data.job_name;
        this.startCheckStatus(this.jobId);
      }
    },
    handleUploadFail(response, file) {
    },

    onChange(file, fileList) {
      if (this.fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]]//这一步，是 展示最后一次选择文件
      }
    },
    clearUploadedFile() {
      if (this.fileList.length > 0) {
        this.fileList = []
      }
    },
    // 开始校验
    beginCheck() {
      this.isLoading = true;
      this.isChecking = true;
      document.getElementById('remark').innerHTML = '请勿关闭页面，文档校准中...'
    },
    // 失败退出
    errorEndCheck() {
      this.isLoading = false;
      this.isChecking = false;
      this.clearUploadedFile();
      document.getElementById('remark').innerHTML = '使用Wchecker润色您的英文文档'
    },
    // 成功完成
    successEndCheck() {
      // this.isLoading = false;
      // this.isChecking = false;
      document.getElementById('remark').innerHTML = '校对完成，文档下载中...'
    },
    // 成功完成
    downloadSuccessEndCheck() {
      this.isLoading = false;
      this.isChecking = false;
      this.jobId = null;
      this.jobName = '';
      this.clearUploadedFile();
      document.getElementById('remark').innerHTML = '使用Wchecker润色您的英文文档'
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
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
  height: 250px;
}

.homePage {
  background-color: rgb(223, 224, 230);
  width: 100vw;
  height: 100vh;
}
</style>

<style>
.loading {
  z-index: 100;
  margin-top: 100px;
  display: inline-block;
  color: #ddd;
  position: absolute;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 35px;
  letter-spacing: 0.083333em;
}

.loading::before {
  content: "";
  position: absolute;
  right: 1.442333em;
  bottom: 0.408333rem;
  height: 0.583333em;
  width: 0.114166em;
  background: currentColor;
  animation: loading-animation-l 1s linear infinite alternate;
}

.loading::after {
  content: "";
  width: 0.308333rem;
  height: 0.308333rem;
  position: absolute;
  left: 2.604166em;
  top: 0.041666em;
  border-radius: 50%;
  background: rgb(24, 39, 215);
  animation: loading-animation 1s linear infinite alternate;
}

@keyframes loading-animation-l {
  0% {
    box-shadow: 0 -0.125em, -2.583333em -0.145833em;
  }

  25%,
  75% {
    box-shadow: 0 0px, -2.583333em -0.145833em;
  }

  100% {
    box-shadow: 0 0px, -2.583333em -0.333333em;
  }
}

@keyframes loading-animation {
  0% {
    transform: translate(0px, 0px) scaleX(1);
  }

  14% {
    transform: translate(-0.25em, -0.333333em) scaleX(1.05);
  }

  28% {
    transform: translate(-0.5625em, -0.583333em) scaleX(1.07);
  }

  42% {
    transform: translate(-0.958333em, -0.729166em) scaleX(1.1);
  }

  57% {
    transform: translate(-1.458333em, -0.770833em) scaleX(1.1);
  }

  71% {
    transform: translate(-1.958333em, -0.666666em) scaleX(1.07);
  }

  85% {
    transform: translate(-2.3125em, -0.458333em) scaleX(1.05);
  }

  100% {
    transform: translate(-2.604166em, -0.1875em) scaleX(1);
  }
}
</style>
