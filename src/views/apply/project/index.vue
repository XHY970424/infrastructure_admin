<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="项目名称" prop="projectName">
        <el-input
          v-model="queryParams.projectName"
          placeholder="请输入项目名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="项目状态"
          clearable
          size="small"
          style="width: 240px"
        >
          <el-option
            v-for="dict in statusOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索
        </el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置
        </el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['apply:project:add']"
          >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          @click="recoveryStation"
          >{{ queryParams.isDeleted == 0 ? "回收站" : "退出回收站" }}
        </el-button>
      </el-col>
    </el-row>

    <el-table
      v-loading="loading"
      :data="projectList"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column label="项目名称" align="center" prop="projectName" />
      <el-table-column
        label="项目简介"
        align="center"
        :show-overflow-tooltip="true"
        prop="projectIntro"
      />
      <el-table-column label="课题数" align="center" prop="subjectNum" />
      <el-table-column label="实名认证" align="center" prop="auth">
        <template slot-scope="scope">
          <span> {{ scope.row.auth === 1 ? "需要" : "不需要" }} </span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="创建人"
        prop="createBy"
        align="center"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ formatTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="300"
        v-if="queryParams.isDeleted == 0"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleInfo(scope.row)"
            v-hasPermi="['apply:project:query']"
            >查看详情
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['apply:project:edit']"
            >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            v-hasPermi="['apply:topic:list']"
            @click="goTopic(scope.row)"
            >课题列表
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="applySet(scope.row)"
            >报名表配置
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="conditionSet(scope.row)"
            >报名条件配置
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['apply:project:remove']"
            >删除
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="300"
        v-else
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleRecover(scope.row)"
            v-hasPermi="['apply:project:recover']"
            >恢复
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改报名项目对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="项目名称" prop="projectName">
          <el-input
            v-model="form.projectName"
            :maxlength="30"
            show-word-limit
            placeholder="请输入项目名称"
          />
        </el-form-item>
        <el-form-item label="项目简介" prop="projectIntro">
          <el-input
            v-model="form.projectIntro"
            type="textarea"
            :rows="6"
            show-word-limit
            :maxlength="400"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="状态" v-if="isAdd">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictValue"
              >{{ dict.dictLabel }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="实名认证">
          <el-radio-group v-model="form.auth">
            <el-radio :label="1">需要</el-radio>
            <el-radio :label="0">不需要</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 查看详情 -->
    <el-dialog
      title="项目详情"
      :visible.sync="infoOpen"
      width="500px"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="项目名称："
              >{{ info.projectName }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="实名认证：">
              {{ info.auth === 1 ? "需要" : "不需要" }}
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="项目简介："
              >{{ info.projectIntro }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建人：">{{ info.createBy }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="创建时间："
              >{{ formatTime(info.createTime) }}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="infoOpen = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 查看详情end -->
    <!-- 报名表配置 -->
    <el-dialog
      title="报名表配置"
      :visible.sync="applyOpen"
      custom-class="apply-dialog"
      width="800px"
      append-to-body
    >
      <div class="main">
        <el-table
          :data="item.fieldList"
          v-for="item in applyList"
          :key="item.fieldId"
          row-key="fieldId"
          border
          style="width: 100%"
          :tree-props="{ children: 'children' }"
        >
          <el-table-column :label="item.name" align="center">
            <el-table-column label="序号" align="center" prop="orderNum" />
            <el-table-column label="字段名称" align="center" prop="fieldName" />
            <el-table-column label="字段类型" align="center" prop="typeName" />
            <el-table-column label="显示/隐藏" align="center" prop="isShow">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.isShow"
                  :disabled="scope.row.isDisabled"
                  @change="switchChange(scope.row)"
                  :active-value="true"
                  :inactive-value="false"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="是否必填" align="center" prop="necessary">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.necessary"
                  :disabled="scope.row.isDisabled || !scope.row.isShow"
                  :active-value="1"
                  :inactive-value="0"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column
              label="触发选项值"
              align="center"
              prop="optionValue"
            >
              <template slot-scope="scope">
                <div style="color: #409eff">{{ scope.row.optionValue }}</div>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitSet">确 定</el-button>
        <el-button @click="applyOpen = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 报名表配置end -->
    <!-- 报名条件配置 -->
    <el-dialog
      title="报名条件配置"
      :visible.sync="conditionOpen"
      custom-class="apply-dialog"
      width="1500px"
      append-to-body
    >
      <el-dropdown trigger="click" @command="addCondition">
        <el-button type="primary" icon="el-icon-plus" size="mini"
          >新增
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="obj">新增条件</el-dropdown-item>
          <el-dropdown-item command="list">新增数组</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <div class="main" style="margin-top: 20px">
        <div
          class="box"
          v-for="(ite, ind) in condition.conditionList"
          :key="ind + 'a'"
          style="margin-bottom: 20px"
        >
          <el-row style="margin-bottom: 20px">
            <el-col :span="2" v-if="ind == 0">
              <div
                style="
                  text-align: center;
                  width: 100%;
                  height: 32px;
                  line-height: 32px;
                "
              >
                Where
              </div>
            </el-col>
            <el-col :span="2" v-else-if="ind == 1">
              <el-select
                v-model="condition.unionType"
                placeholder="请选择关系"
                size="small"
                style="width: 90%"
              >
                <el-option
                  v-for="dict in unionType"
                  :key="dict.value"
                  :label="dict.key"
                  :value="dict.value"
                />
              </el-select>
            </el-col>
            <el-col :span="2" v-else>
              <div style="text-align: center; width: 100%">
                {{ getUnionType(condition.unionType) }}
              </div>
            </el-col>
            <el-col :span="7">
              <el-select
                v-model="ite.fieldId"
                placeholder="请选择字段"
                clearable
                size="small"
                style="width: 90%"
                @change="firldChange(ite.fieldId, -1, ind)"
              >
                <el-option
                  v-for="dict in applyOptions"
                  :key="dict.fieldId"
                  :label="
                    `${dict.fieldName}${
                      dict.optionValue ? `(${dict.optionValue})` : ''
                    }` + `${dict.typeKey == 'DATE_LIMIT' ? '(年限)' : ''}`
                  "
                  :value="dict.fieldId"
                />
              </el-select>
            </el-col>
            <el-col :span="3">
              <el-select
                v-model="ite.compareType"
                placeholder="请选择条件"
                clearable
                size="small"
                style="width: 90%"
              >
                <el-option
                  v-show="dict.type.includes(ite.inputType)"
                  v-for="dict in compareType"
                  :key="dict.value"
                  :label="dict.key"
                  :value="dict.value"
                />
              </el-select>
            </el-col>
            <el-col :span="10">
              <el-select
                v-model="ite.selectItem"
                placeholder="请选择"
                clearable
                v-if="ite.inputType && ite.inputType == 'select'"
                size="small"
                style="width: 90%"
              >
                <el-option
                  v-for="dict in tree.conditionList[ind].list"
                  :key="dict.dictId"
                  :label="dict.dictName"
                  :value="dict.dictName"
                />
              </el-select>
              <template
                v-else-if="ite.inputType && selectType.includes(ite.inputType)"
              >
                <el-input
                  v-model="ite.selectItem"
                  v-show="ite.isEcho"
                  placeholder="请输入值"
                  clearable
                  @input="empty('child', -1, ind)"
                  @focus="empty('child', -1, ind)"
                  size="small"
                  style="width: 90%"
                />
                <el-row v-show="!ite.isEcho">
                  <el-col
                    :span="24 / Number(ite.selectNum)"
                    v-for="(select, selectIndex) in Number(ite.selectNum)"
                    :key="selectIndex + 'b'"
                  >
                    <el-select
                      v-model="tree.conditionList[ind].val[selectIndex]"
                      placeholder="请选择"
                      clearable
                      size="small"
                      style="width: 90%"
                      v-if="selectIndex == 0"
                      @change="
                        muchChange(
                          ite.fieldId,
                          ite.selectNum,
                          selectIndex,
                          -1,
                          ind
                        )
                      "
                    >
                      <el-option
                        v-for="dict in tree.conditionList[ind].list"
                        :key="dict.dictId"
                        :label="dict.dictName"
                        :value="dict.dictId"
                      />
                    </el-select>
                    <el-select
                      v-model="tree.conditionList[ind].val[selectIndex]"
                      placeholder="请选择"
                      clearable
                      size="small"
                      style="width: 90%"
                      v-else
                      @change="
                        muchChange(
                          ite.fieldId,
                          ite.selectNum,
                          selectIndex,
                          -1,
                          ind
                        )
                      "
                    >
                      <el-option
                        v-for="dict in tree.conditionList[ind][
                          `child${selectIndex}`
                        ]"
                        :key="dict.dictId"
                        :label="dict.dictName"
                        :value="dict.dictId"
                      />
                    </el-select>
                  </el-col>
                </el-row>
              </template>
              <template v-else-if="ite.inputType && ite.inputType == 'radio'">
                <el-radio
                  v-model="ite.selectItem"
                  v-for="dict in tree.conditionList[ind].list"
                  :key="dict.dictId"
                  :label="dict.dictKey"
                  >{{ dict.dictName }}
                </el-radio>
              </template>
              <el-checkbox-group
                v-else-if="ite.inputType && ite.inputType == 'checkbox'"
                v-model="ite.selectItem"
              >
                <el-checkbox
                  v-for="dict in tree.conditionList[ind].list"
                  :key="dict.dictId"
                  :label="dict.dictKey"
                  >{{ dict.dictName }}
                </el-checkbox>
              </el-checkbox-group>
              <el-input-number
                size="small"
                controls-position="right"
                style="width: 90%"
                v-model="ite.selectItem"
                v-else-if="
                  ite.inputType &&
                  (ite.inputType == 'date' || ite.inputType == 'datetime') &&
                  ite.typeKey == 'DATE_LIMIT'
                "
              ></el-input-number>
              <el-date-picker
                v-model="ite.selectItem"
                v-else-if="ite.inputType && ite.inputType == 'date'"
                type="date"
                size="small"
                style="width: 90%"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              >
              </el-date-picker>
              <el-date-picker
                v-model="ite.selectItem"
                v-else-if="ite.inputType && ite.inputType == 'datetime'"
                type="datetime"
                size="small"
                style="width: 90%"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间"
              >
              </el-date-picker>
              <el-input
                v-model="ite.selectItem"
                v-else
                placeholder="请输入值"
                clearable
                size="small"
                style="width: 90%"
              />
            </el-col>
            <el-col :span="2">
              <el-button
                size="medium"
                type="text"
                icon="el-icon-delete"
                style="color: #ccc; margin-left: 20px"
                @click="delItem('conditionList', ind, -1)"
              ></el-button>
            </el-col>
          </el-row>
        </div>
        <div
          class="box"
          v-for="(item, index) in condition.child"
          :key="index"
          style="margin-bottom: 20px"
        >
          <el-row>
            <el-col
              :span="2"
              v-if="index == 0 && condition.conditionList.length == 0"
            >
              <div style="text-align: center; width: 100%">Where</div>
            </el-col>
            <el-col
              :span="2"
              v-else-if="
                (index == 1 && condition.conditionList.length == 0) ||
                (condition.conditionList.length < 2 && index == 0)
              "
            >
              <el-select
                v-model="condition.unionType"
                placeholder="请选择关系"
                size="small"
                style="width: 90%"
              >
                <el-option
                  v-for="dict in unionType"
                  :key="dict.value"
                  :label="dict.key"
                  :value="dict.value"
                />
              </el-select>
            </el-col>
            <el-col :span="2" v-else>
              <div style="text-align: center; width: 100%">
                {{ getUnionType(condition.unionType) }}
              </div>
            </el-col>
            <el-col :span="20">
              <div
                style="
                  padding: 20px;
                  box-sizing: border-box;
                  width: 100%;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12),
                    0 0 6px rgba(0, 0, 0, 0.04);
                  border-radius: 6px;
                "
              >
                <el-row
                  v-for="(ite, i) in item.conditionList"
                  :key="i"
                  style="margin-bottom: 20px"
                >
                  <el-col :span="2" v-if="i == 0">
                    <div
                      style="
                        text-align: center;
                        width: 100%;
                        height: 32px;
                        line-height: 32px;
                      "
                    >
                      Where
                    </div>
                  </el-col>
                  <el-col :span="2" v-else-if="i == 1">
                    <el-select
                      v-model="item.unionType"
                      placeholder="请选择关系"
                      size="small"
                      style="width: 90%"
                    >
                      <el-option
                        v-for="dict in unionType"
                        :key="dict.value"
                        :label="dict.key"
                        :value="dict.value"
                      />
                    </el-select>
                  </el-col>
                  <el-col :span="2" v-else>
                    <div style="text-align: center; width: 100%">
                      {{ getUnionType(item.unionType) }}
                    </div>
                  </el-col>
                  <el-col :span="6">
                    <el-select
                      v-model="ite.fieldId"
                      placeholder="请选择字段"
                      clearable
                      size="small"
                      style="width: 90%"
                      @change="firldChange(ite.fieldId, index, i)"
                    >
                      <el-option
                        v-for="dict in applyOptions"
                        :key="dict.fieldId"
                        :label="
                          `${dict.fieldName}${
                            dict.optionValue ? `(${dict.optionValue})` : ''
                          }` + `${dict.typeKey == 'DATE_LIMIT' ? '(年限)' : ''}`
                        "
                        :value="dict.fieldId"
                      />
                    </el-select>
                  </el-col>
                  <el-col :span="3">
                    <el-select
                      v-model="ite.compareType"
                      placeholder="请选择条件"
                      clearable
                      size="small"
                      style="width: 90%"
                    >
                      <el-option
                        v-show="dict.type.includes(ite.inputType)"
                        v-for="dict in compareType"
                        :key="dict.value"
                        :label="dict.key"
                        :value="dict.value"
                      />
                    </el-select>
                  </el-col>
                  <el-col :span="11">
                    <el-select
                      v-model="ite.selectItem"
                      placeholder="请选择"
                      clearable
                      v-if="ite.inputType && ite.inputType == 'select' &&  isShowSelect(index,i)"
                      size="small"
                      style="width: 90%"
                    >
                      <el-option
                        v-for="dict in tree.child[index].conditionList[i].list"
                        :key="dict.dictId"
                        :label="dict.dictName"
                        :value="dict.dictName"
                      />
                    </el-select>
                    <template
                      v-else-if="
                        ite.inputType && selectType.includes(ite.inputType)
                      "
                    >
                      <el-input
                        v-model="ite.selectItem"
                        v-show="ite.isEcho"
                        placeholder="请输入值"
                        clearable
                        @input="empty('child', index, i)"
                        @focus="empty('child', index, i)"
                        size="small"
                        style="width: 90%"
                      />
                      <el-row v-show="!ite.isEcho">
                        <el-col
                          :span="24 / Number(ite.selectNum)"
                          v-for="(select, selectIndex) in Number(ite.selectNum)"
                          :key="selectIndex + 'b'"
                        >
                          <el-select
                            v-model="
                              tree.child[index].conditionList[i].val[
                                selectIndex
                              ]
                            "
                            placeholder="请选择"
                            clearable
                            size="small"
                            style="width: 90%"
                            v-if="selectIndex == 0"
                            @change="
                              muchChange(
                                ite.fieldId,
                                ite.selectNum,
                                selectIndex,
                                index,
                                i
                              )
                            "
                          >
                            <el-option
                              v-for="dict in tree.child[index].conditionList[i]
                                .list"
                              :key="dict.dictId"
                              :label="dict.dictName"
                              :value="dict.dictId"
                            />
                          </el-select>
                          <el-select
                            v-model="
                              tree.child[index].conditionList[i].val[
                                selectIndex
                              ]
                            "
                            placeholder="请选择"
                            clearable
                            size="small"
                            style="width: 90%"
                            v-else
                            @change="
                              muchChange(
                                ite.fieldId,
                                ite.selectNum,
                                selectIndex,
                                index,
                                i
                              )
                            "
                          >
                            <el-option
                              v-for="dict in tree.child[index].conditionList[i][
                                `child${selectIndex}`
                              ]"
                              :key="dict.dictId"
                              :label="dict.dictName"
                              :value="dict.dictId"
                            />
                          </el-select>
                        </el-col>
                      </el-row>
                    </template>
                    <template
                      v-else-if="ite.inputType && ite.inputType == 'radio'"
                    >
                      <el-radio
                        v-model="ite.selectItem"
                        v-for="dict in tree.child[index].conditionList[i].list"
                        :key="dict.dictName"
                        :label="dict.dictKey"
                        >{{ dict.dictName }}
                      </el-radio>
                    </template>
                    <el-checkbox-group
                      v-else-if="ite.inputType && ite.inputType == 'checkbox'"
                      v-model="ite.selectItem"
                    >
                      <el-checkbox
                        v-for="dict in tree.child[index].conditionList[i].list"
                        :key="dict.dictId"
                        :label="dict.dictKey"
                        >{{ dict.dictName }}
                      </el-checkbox>
                    </el-checkbox-group>
                    <el-input-number
                      size="small"
                      controls-position="right"
                      style="width: 90%"
                      v-model="ite.selectItem"
                      v-else-if="
                        ite.inputType &&
                        (ite.inputType == 'date' ||
                          ite.inputType == 'datetime') &&
                        ite.typeKey == 'DATE_LIMIT'
                      "
                    ></el-input-number>
                    <el-date-picker
                      v-model="ite.selectItem"
                      v-else-if="ite.inputType && ite.inputType == 'date'"
                      type="date"
                      size="small"
                      style="width: 90%"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期"
                    >
                    </el-date-picker>
                    <el-date-picker
                      v-model="ite.selectItem"
                      v-else-if="ite.inputType && ite.inputType == 'datetime'"
                      type="datetime"
                      size="small"
                      style="width: 90%"
                      format="yyyy-MM-dd HH:mm:ss"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择日期时间"
                    >
                    </el-date-picker>
                    <el-input
                      v-model="ite.selectItem"
                      v-else
                      placeholder="请输入值"
                      clearable
                      size="small"
                      style="width: 90%"
                    />
                  </el-col>
                  <el-col :span="2">
                    <el-button
                      size="small"
                      type="text"
                      icon="el-icon-delete"
                      style="color: #ccc"
                      @click="delItem('child', index, i)"
                    ></el-button>
                  </el-col>
                </el-row>
                <div class="flex flex-jend" style="width: 100%">
                  <el-button
                    type="primary"
                    icon="el-icon-plus"
                    size="mini"
                    @click="addChildCondition(index)"
                    >新增
                  </el-button>
                </div>
              </div>
            </el-col>
            <el-col :span="2">
              <el-button
                size="medium"
                type="text"
                icon="el-icon-delete"
                style="color: #ccc; margin-left: 20px"
                @click="delItem('child', index, -1)"
              ></el-button>
            </el-col>
          </el-row>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitCondition">确 定</el-button>
        <el-button @click="conditionOpen = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 报名条件配置end -->
  </div>
</template>

<script>
var self;
import {
  addProject,
  delProject,
  getProject,
  listProject,
  queryAllGroupByColumn,
  queryFormCondition,
  recover,
  saveProjectApply,
  saveProjectCondition,
  topicConditionField,
  topicForm,
  treeList,
  updateProject,
  updateStatus,
} from "@/api/apply/project";

export default {
  name: "Project",
  computed:{
    isShowSelect(){
      return(index,i)=>{
        if(this.tree.child[index]){
          // console.log(this.tree.child[index],1)
          if(this.tree.child[index].conditionList){
            // console.log(this.tree.child[index].conditionList,2)
            if(this.tree.child[index].conditionList[i]){
              // console.log(this.tree.child[index].conditionList[i].list,3)
              return true
            }
          }
        }
        return false
      }
    }
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 状态数据字典
      statusOptions: [],
      //报名表数据字典
      applyOptions: [],
      //关系字典
      unionType: [
        {
          key: "and",
          value: "MA",
        },
        {
          key: "or",
          value: "HM",
        },
      ],
      tree: {
        conditionList: [],
        child: [],
      },
      treeInputType: [
        "select",
        "radio",
        "checkbox",
        "lazy_tree_3",
        "lazy_tree_2",
      ],
      selectType: ["select", "lazy_tree_3", "lazy_tree_2"],
      //比较方式字典
      compareType: [
        {
          key: ">",
          value: "gt",
          type: ["date", "datetime", "num"],
        },
        {
          key: "<",
          value: "lt",
          type: ["date", "datetime", "num"],
        },
        {
          key: ">=",
          value: "ge",
          type: ["date", "datetime", "num"],
        },
        {
          key: "<=",
          value: "le",
          type: ["date", "datetime", "num"],
        },
        {
          key: "==",
          value: "eq",
          type: [
            "date",
            "datetime",
            "num",
            "text",
            "lazy_tree_3",
            "lazy_tree_2",
            "select",
            "radio",
            "checkbox",
          ],
        },
        {
          key: "!==",
          value: "ne",
          type: [
            "date",
            "datetime",
            "num",
            "text",
            "lazy_tree_3",
            "lazy_tree_2",
            "select",
            "radio",
            "checkbox",
          ],
        },
        {
          key: "包含",
          value: "c",
          type: ["text", "lazy_tree_3", "lazy_tree_2", "checkbox"],
        },
        {
          key: "不包含",
          value: "nc",
          type: ["text", "lazy_tree_3", "lazy_tree_2", "checkbox"],
        },
      ],
      // 报名项目表格数据
      projectList: [],
      //报名表配置列表
      applyList: [],
      // 弹出层标题
      title: "",
      //是否新增
      isAdd: true,
      // 是否显示弹出层
      open: false,
      //是否显示详情弹出层
      infoOpen: false,
      //是否显示报名表配置弹出层
      applyOpen: false,
      //是否显示报名条件配置弹出层
      conditionOpen: false,
      //配置条件
      condition: {
        unionType: "MA",
        projectId: "",
        conditionList: [],
        child: [],
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        projectName: undefined,
        status: undefined,
        isDeleted: 0,
      },
      // 表单参数
      form: {},
      //项目详情
      info: {},
      // 表单校验
      rules: {
        projectName: [
          { required: true, message: "项目名称不能为空", trigger: "blur" },
        ],
      },
      //项目id
      projectId: "",
    };
  },
  created() {
    self = this;
    this.getList();
    this.getDicts("apply_project_status").then((response) => {
      this.statusOptions = response.data;
    });
  },
  methods: {
    //开关状态改变
    switchChange(item) {
      item.nestForm.forEach((ite) => {
        ite.isDisabled = item.isShow ? false : true;
      });
    },
    //二三级联动
    muchChange(val, selectNum, selectIndex, fIndex, cIndex) {
      let index = this.applyOptions.findIndex((item) => item.fieldId == val);
      let fieldDictId = this.applyOptions[index].formDictId;
      if (selectIndex == 0) {
        if (fIndex != -1) {
          if (!this.tree.child[fIndex].conditionList[cIndex].val[selectIndex]) {
            return;
          }
          let i = this.tree.child[fIndex].conditionList[cIndex].list.findIndex(
            (item) =>
              item.dictId ==
              this.tree.child[fIndex].conditionList[cIndex].val[selectIndex]
          );
          let val =
            this.tree.child[fIndex].conditionList[cIndex].list[i].dictName;
          this.tree.child[fIndex].conditionList[cIndex].name = [];
          this.tree.child[fIndex].conditionList[cIndex].name[selectIndex] = val;
        } else {
          if (!this.tree.conditionList[cIndex].val[selectIndex]) {
            return;
          }
          let i = this.tree.conditionList[cIndex].list.findIndex(
            (item) =>
              item.dictId == this.tree.conditionList[cIndex].val[selectIndex]
          );
          let val = this.tree.conditionList[cIndex].list[i].dictName;
          this.tree.conditionList[cIndex].name = [];
          this.tree.conditionList[cIndex].name[selectIndex] = val;
        }
      } else {
        if (fIndex != -1) {
          if (!this.tree.child[fIndex].conditionList[cIndex].val[selectIndex]) {
            return;
          }
          let i = this.tree.child[fIndex].conditionList[cIndex][
            `child${selectIndex}`
          ].findIndex(
            (item) =>
              item.dictId ==
              this.tree.child[fIndex].conditionList[cIndex].val[selectIndex]
          );
          let val =
            this.tree.child[fIndex].conditionList[cIndex][
              `child${selectIndex}`
            ][i].dictName;
          this.tree.child[fIndex].conditionList[cIndex].name[selectIndex] = val;
        } else {
          if (!this.tree.conditionList[cIndex].val[selectIndex]) {
            return;
          }
          let i = this.tree.conditionList[cIndex][
            `child${selectIndex}`
          ].findIndex(
            (item) =>
              item.dictId == this.tree.conditionList[cIndex].val[selectIndex]
          );
          let val =
            this.tree.conditionList[cIndex][`child${selectIndex}`][i].dictName;
          this.tree.conditionList[cIndex].name[selectIndex] = val;
        }
      }
      if (fIndex != -1) {
        let selectItem = this.tree.child[fIndex].conditionList[cIndex].name;
        this.condition.child[fIndex].conditionList[cIndex].selectItem =
          selectItem.join("-");
      } else {
        let selectItem = this.tree.conditionList[cIndex].name;
        this.condition.conditionList[cIndex].selectItem = selectItem.join("-");
      }
      treeList({
        fieldDictId: fieldDictId,
        parentId:
          fIndex != -1
            ? this.tree.child[fIndex].conditionList[cIndex].val[selectIndex]
            : this.tree.conditionList[cIndex].val[selectIndex],
      }).then((res) => {
        if (fIndex != -1) {
          this.tree.child[fIndex].conditionList[cIndex][
            `child${selectIndex + 1}`
          ] = res.data;
          this.tree.child[fIndex].conditionList[cIndex].val[selectIndex + 1] =
            res.data[0].dictId;
          this.tree.child[fIndex].conditionList[cIndex].name[selectIndex + 1] =
            res.data[0].dictName;
        } else {
          this.tree.conditionList[cIndex][`child${selectIndex + 1}`] = res.data;
          this.tree.conditionList[cIndex].val[selectIndex + 1] =
            res.data[0].dictId;
          this.tree.conditionList[cIndex].name[selectIndex + 1] =
            res.data[0].dictName;
        }
        if (selectIndex + 2 == selectNum) {
          if (fIndex != -1) {
            let selectItem = this.tree.child[fIndex].conditionList[cIndex].name;
            this.condition.child[fIndex].conditionList[cIndex].selectItem =
              selectItem.join("-");
          } else {
            let selectItem = this.tree.conditionList[cIndex].name;
            this.condition.conditionList[cIndex].selectItem =
              selectItem.join("-");
          }

          return;
        }
        this.$forceUpdate();
      });
    },
    //删除条件/条件数组
    delItem(key, fIndex, cIndex) {
      if (cIndex != -1) {
        this.condition[key][fIndex].conditionList.splice(cIndex, 1);
        if (this.condition[key][fIndex].conditionList.length == 0) {
          this.condition[key].splice(fIndex, 1);
        }
      } else {
        this.condition[key].splice(fIndex, 1);
      }
    },
    //清空多级选择框
    empty(key, fIndex, cIndex) {
      if (cIndex != -1) {
        this.condition[key][fIndex].conditionList[cIndex].isEcho = false;
        this.condition[key][fIndex].conditionList[cIndex].selectItem = "";
      } else {
        this.condition[key][fIndex].isEcho = false;
        this.condition[key][fIndex].selectItem = "";
      }
    },
    //获取条件名称
    getUnionType(value) {
      let index = this.unionType.findIndex((item) => item.value == value);
      return this.unionType[index].key;
    },
    //选择字段
    firldChange(val, fIndex, cIndex) {
      let index = this.applyOptions.findIndex((item) => item.fieldId == val);
      let fieldDictId = this.applyOptions[index].formDictId;
      if (fIndex != -1) {
        this.condition.child[fIndex].conditionList[cIndex].fieldKey =
          this.applyOptions[index].fieldKey;
        this.condition.child[fIndex].conditionList[cIndex].fieldName =
          this.applyOptions[index].fieldName;
        this.condition.child[fIndex].conditionList[cIndex].inputType =
          this.applyOptions[index].inputType;
        this.condition.child[fIndex].conditionList[cIndex].typeKey =
          this.applyOptions[index].typeKey;
        if (this.applyOptions[index].inputType.indexOf("lazy_tree") != -1) {
          let inputType = this.applyOptions[index].inputType.split("_");
          this.condition.child[fIndex].conditionList[cIndex].selectNum =
            inputType[2];
          this.condition.child[fIndex].conditionList[cIndex].isEcho = false;
        }
        this.condition.child[fIndex].conditionList[cIndex].compareType = "";
        this.condition.child[fIndex].conditionList[cIndex].selectItem =
          this.applyOptions[index].inputType == "checkbox" ? [] : "";
        this.condition.child[fIndex].conditionList[cIndex].fieldDictId =
          fieldDictId;
      } else {
        this.condition.conditionList[cIndex].fieldKey =
          this.applyOptions[index].fieldKey;
        this.condition.conditionList[cIndex].fieldName =
          this.applyOptions[index].fieldName;
        this.condition.conditionList[cIndex].inputType =
          this.applyOptions[index].inputType;
        this.condition.conditionList[cIndex].typeKey =
          this.applyOptions[index].typeKey;
        if (this.applyOptions[index].inputType.indexOf("lazy_tree") != -1) {
          let inputType = this.applyOptions[index].inputType.split("_");
          this.condition.conditionList[cIndex].selectNum = inputType[2];
          this.condition.conditionList[cIndex].isEcho = false;
        }
        this.condition.conditionList[cIndex].compareType = "";
        this.condition.conditionList[cIndex].selectItem =
          this.applyOptions[index].inputType == "checkbox" ? [] : "";
        this.condition.conditionList[cIndex].fieldDictId = fieldDictId;
      }
      if (this.treeInputType.includes(this.applyOptions[index].inputType)) {
        this.recursionTree(fieldDictId, 0, fIndex, cIndex);
      }
    },
    //获取动态表单选项字典
    async recursionTree(fieldDictId, parentId, fIndex, cIndex) {
      if (fIndex != -1) {
        if(!this.tree.child[fIndex]){
          this.tree.child[fIndex] = { conditionList: [] };
        }
        this.tree.child[fIndex].conditionList[cIndex] = { list: [], val: [] };
      } else {
        if(!this.tree.conditionList[cIndex]){
          this.tree.conditionList[cIndex] = { list: [], val: [] };
        }
      }
      let res = await treeList({ fieldDictId, parentId });
      if (fIndex != -1) {
        this.tree.child[fIndex].conditionList[cIndex].list = res.data;
      } else {
        this.tree.conditionList[cIndex].list = res.data;
      }
      this.$forceUpdate();
    },
    //确定条件配置
    submitCondition() {
      // if (
      //   this.condition.child.length == 0 &&
      //   this.condition.conditionList.length == 0
      // ) {
      //   this.msgError("请先添加条件");
      //   return;
      // }
      for (let item in this.condition.child) {
        for (let ite in this.condition.child[item].conditionList) {
          if (this.condition.child[item].conditionList[ite].fieldId == "") {
            this.msgError("请选择字段");
            return;
          }
          if (this.condition.child[item].conditionList[ite].compareType == "") {
            this.msgError("请选择条件");
            return;
          }
          if (this.condition.child[item].conditionList[ite].selectItem == "") {
            this.msgError("请输入值");
            return;
          }
        }
      }
      for (let index in this.condition.conditionList) {
        if (this.condition.conditionList[index].fieldId == "") {
          this.msgError("请选择字段");
          return;
        }
        if (this.condition.conditionList[index].compareType == "") {
          this.msgError("请选择条件");
          return;
        }
        if (this.condition.conditionList[index].selectItem == "") {
          this.msgError("请输入值");
          return;
        }
      }
      saveProjectCondition(this.condition).then((res) => {
        this.conditionOpen = false;
        this.msgSuccess("配置成功");
      });
    },
    //新增条件配置
    addCondition(command) {
      if (command == "list") {
        let obj = {
          unionType: "MA",
          conditionList: [
            {
              fieldId: "",
              fieldKey: "",
              fieldName: "",
              compareType: "",
              selectItem: "",
            },
          ],
        };
        this.condition.child.push(obj);
      } else {
        let obj = {
          fieldId: "",
          fieldKey: "",
          fieldName: "",
          compareType: "",
          selectItem: "",
        };
        this.condition.conditionList.push(obj);
      }
    },
    //嵌套条件配置
    addChildCondition(fIndex) {
      let obj = {
        fieldId: "",
        fieldKey: "",
        fieldName: "",
        compareType: "",
        selectItem: "",
      };
      this.condition.child[fIndex].conditionList.push(obj);
    },
    //提交配置信息
    submitSet() {
      let data = [];
      this.applyList.forEach((item) => {
        item.fieldList.forEach((ite) => {
          if (ite.isShow) {
            data.push({
              fieldId: ite.fieldId,
              necessary: ite.necessary,
              attachmentFlag: ite.attachmentFlag == 1 ? 1 : 0,
              attachmentRemark: ite.attachmentRemark
                ? ite.attachmentRemark
                : undefined,
              attachmentSuffix: ite.attachmentSuffix
                ? ite.attachmentSuffix
                : undefined,
            });
            data = this.recursionSubmit(ite, data);
          }
        });
      });
      saveProjectApply({ projectId: this.projectId, data }).then((res) => {
        this.applyOpen = false;
        this.msgSuccess("配置成功");
      });
    },
    //嵌套子表单递归提交
    recursionSubmit(item, list) {
      item.nestForm.forEach((ite) => {
        if (ite.isShow && item.isShow) {
          list.push({
            fieldId: ite.fieldId,
            necessary: ite.necessary,
            attachmentFlag: ite.attachmentFlag == 1 ? 1 : 0,
            attachmentRemark: ite.attachmentRemark
              ? ite.attachmentRemark
              : undefined,
            attachmentSuffix: ite.attachmentSuffix
              ? ite.attachmentSuffix
              : undefined,
          });
          list = this.recursionSubmit(ite, list);
        }
      });
      return list;
    },
    //获取报名条件配置
    conditionSet(row) {
      this.condition = {
        unionType: "MA",
        projectId: "",
        conditionList: [],
        child: [],
      };
      const projectId = row.projectId;
      this.condition.projectId = projectId;
      Promise.all([
        topicConditionField(projectId),
        queryFormCondition(projectId),
      ]).then((res) => {
        this.applyOptions = res[0].data;
        if (res[1].data) {
          let condition = res[1].data;
          condition.child = condition.child ? condition.child : [];
          condition.conditionList = condition.conditionList
            ? condition.conditionList
            : [];
          condition.child.forEach((item, ind) => {
            item.conditionList.forEach((ite, i) => {
              let index = this.applyOptions.findIndex(
                (item) => item.fieldId == ite.fieldId
              );
              ite.inputType = this.applyOptions[index].inputType;
              ite.typeKey = this.applyOptions[index].typeKey;
              if (
                this.treeInputType.includes(this.applyOptions[index].inputType)
              ) {
                this.recursionTree(
                  this.applyOptions[index].formDictId,
                  0,
                  ind,
                  i
                );
              }
              if (ite.inputType.indexOf("lazy_tree") != -1) {
                let inputType = ite.inputType.split("_");
                ite.selectNum = inputType[2];
                ite.isEcho = true;
              }
            });
          });
          condition.conditionList.forEach((ite, i) => {
            let index = this.applyOptions.findIndex(
              (item) => item.fieldId == ite.fieldId
            );
            ite.inputType = this.applyOptions[index].inputType;
            ite.typeKey = this.applyOptions[index].typeKey;
            if (ite.inputType.indexOf("lazy_tree") != -1) {
              let inputType = ite.inputType.split("_");
              ite.selectNum = inputType[2];
              ite.isEcho = true;
            }
            if (
              this.treeInputType.includes(this.applyOptions[index].inputType)
            ) {
              this.recursionTree(this.applyOptions[index].formDictId, 0, -1, i);
            }
          });
          this.condition = condition;
        }
        this.conditionOpen = true;
      });
    },
    //获取报名表配置列表
    applySet(row) {
      const projectId = row.projectId;
      this.projectId = projectId;
      Promise.all([topicForm(projectId), queryAllGroupByColumn()]).then(
        (res) => {
          let use = res[0].data;
          let list = res[1].data;
          list.forEach((item) => {
            item.fieldList.forEach((ite) => {
              let index = use.findIndex((i) => i.fieldId == ite.fieldId);
              ite.isDisabled = false;
              if (index != -1) {
                ite.isShow = true;
                ite.necessary = use[index].necessary;
              }
              ite = this.recursion(ite, use);
            });
          });
          this.applyList = list;
          this.applyOpen = true;
        }
      );
    },
    //嵌套子表单递归
    recursion(item, use) {
      item.nestForm.forEach((it) => {
        let index = use.findIndex((data) => data.fieldId == it.fieldId);
        it.isDisabled = item.isShow ? false : true;
        if (index != -1) {
          it.isShow = true;
          it.necessary = use[index].necessary;
        }
        it = this.recursion(it, use);
      });
      item.children = item.nestForm;
      return item;
    },
    //跳转课题列表
    goTopic(row) {
      let projectId = row.projectId;
      let projectName = row.projectName;
      this.$router.push({
        path: "/apply/topic",
        query: { projectId, projectName },
      });
    },
    //恢复操作
    handleRecover(row) {
      const projectIds = row.projectId || this.ids;
      this.$confirm(
        '是否确认恢复报名项目名为"' + row.projectName + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return recover(projectIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("恢复成功");
        })
        .catch(function () {});
    },
    //进入退出回收站
    recoveryStation() {
      if (this.queryParams.isDeleted == 0) {
        this.queryParams.isDeleted = 2;
      } else {
        this.queryParams.isDeleted = 0;
      }
      this.getList();
    },
    // 状态修改
    handleStatusChange(row) {
      let text = row.status === 1 ? "启用" : "停用";
      this.$confirm(
        '确认要"' + text + '""' + row.projectName + '"项目吗?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return updateStatus({ ids: [row.projectId], status: row.status });
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function () {
          row.status = row.status === 0 ? 1 : 0;
        });
    },
    /** 查询报名项目列表 */
    getList() {
      this.loading = true;
      listProject(this.queryParams).then((response) => {
        this.projectList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        projectId: undefined,
        projectName: undefined,
        projectIntro: undefined,
        subjectNum: undefined,
        applyNum: undefined,
        status: "0",
        createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined,
        isDeleted: undefined,
        auth: 1,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.projectId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.isAdd = true;
      this.open = true;
      this.title = "添加报名项目";
    },
    /**查看详情 */
    handleInfo(row) {
      const projectId = row.projectId || this.ids;
      getProject(projectId).then((response) => {
        this.info = response.data;
        this.infoOpen = true;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.isAdd = false;
      const projectId = row.projectId || this.ids;
      getProject(projectId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改报名项目";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.projectId != undefined) {
            updateProject(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addProject(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const projectIds = row.projectId || this.ids;
      this.$confirm(
        '是否确认删除报名项目名为"' + row.projectName + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delProject(projectIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
  },
};
</script>
<style scoped lang="scss">
.flex {
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  align-items: center;
  -webkit-align-items: center;
  box-align: center;
  -moz-box-align: center;
  -webkit-box-align: center;
}

.flex-jend {
  -webkit-justify-content: flex-end;
  justify-content: flex-end;
  -moz-box-pack: flex-end;
  -webkit--moz-box-pack: flex-end;
  box-pack: flex-end;
}

/deep/ .apply-dialog {
  .main {
    height: 500px;
    overflow-y: scroll;
    overflow-x: hidden;
  }
}
</style>
