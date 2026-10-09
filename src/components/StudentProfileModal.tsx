import React, { useState } from 'react';
import { User, School, Check, X } from 'lucide-react';
import { StudentProfile } from '../types';
import { soundManager } from '../utils/audio';

interface Props {
  profile: StudentProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: StudentProfile) => void;
}

export const StudentProfileModal: React.FC<Props> = ({ profile, isOpen, onClose, onSave }) => {
  const [studentId, setStudentId] = useState(profile.studentId);
  const [studentName, setStudentName] = useState(profile.studentName);
  const [department, setDepartment] = useState(profile.department);
  const [classGroup, setClassGroup] = useState(profile.classGroup);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();
    onSave({
      studentId: studentId.trim() || '未設定學號',
      studentName: studentName.trim() || '餐飲科同學',
      department: department.trim() || '餐飲廚藝管理科',
      classGroup: classGroup.trim() || '一年甲班',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4">
      <div 
        className="bg-white rounded-xl shadow-xl border border-stone-200 max-w-md w-full overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/80">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-amber-800" />
            <h2 className="text-base font-semibold text-stone-900">學生基本資料設定</h2>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-md transition-colors"
            aria-label="關閉"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-xs text-stone-600">
            請輸入您的學號與姓名，系統將自動套用於模擬測驗計分與 PDF 學習成果報告中。
          </p>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              學生學號 <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="例：11234056"
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-amber-700 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              學生姓名 <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="例：陳志豪"
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-amber-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">科系 / 學門</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="例：餐飲廚藝科"
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-amber-700"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">班級 / 組別</label>
              <input
                type="text"
                value={classGroup}
                onChange={(e) => setClassGroup(e.target.value)}
                placeholder="例：高二甲班"
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-amber-700"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg transition-colors shadow-xs"
            >
              <Check className="w-4 h-4" />
              儲存學生資料
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
