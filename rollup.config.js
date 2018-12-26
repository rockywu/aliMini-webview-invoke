/**
 * Created by rocky on 2018/10/17.
 */
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';

export default [
  {
    input: 'entry/aliMP.js',
    output: [
      { file: 'example/aliMini/invoke.js', format: 'es'}
    ],
    plugins: [
      resolve(),
      commonjs(),
      babel({
        exclude: "node_modules/**"
      }),
      // uglify()
    ]
  },
  {
    input: 'entry/webview.js',
    output: [
      { file: 'example/webview/invoke.js', format: 'iife', name: "MpInvoke"}
    ],
    plugins: [
      resolve({}),
      commonjs(),
      babel({
        exclude: "node_modules/**"
      }),
      // uglify()
    ]
  }
];

