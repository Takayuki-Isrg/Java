package com.example.service;

import com.example.entity.User;
import com.example.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService implements UserDetailsService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    /**
     * ユーザー名でユーザーを検索（Spring Security用）
     * @param username ユーザー名
     * @return UserDetails
     * @throws UsernameNotFoundException ユーザーが見つからない場合
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isEmpty()) {
            throw new UsernameNotFoundException("ユーザーが見つかりません: " + username);
        }
        return user.get();
    }
    
    /**
     * 新しいユーザーを作成
     * @param user ユーザー情報
     * @return 作成されたユーザー
     * @throws IllegalArgumentException ユーザー名またはメールアドレスが既に存在する場合
     */
    public User createUser(User user) {
        // ユーザー名の重複チェック
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("このユーザー名は既に使用されています: " + user.getUsername());
        }
        
        // メールアドレスの重複チェック
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("このメールアドレスは既に使用されています: " + user.getEmail());
        }
        
        // パスワードをエンコード
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        return userRepository.save(user);
    }
    
    /**
     * ユーザー名でユーザーを検索
     * @param username ユーザー名
     * @return ユーザー（存在しない場合は空）
     */
    @Transactional(readOnly = true)
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    /**
     * メールアドレスでユーザーを検索
     * @param email メールアドレス
     * @return ユーザー（存在しない場合は空）
     */
    @Transactional(readOnly = true)
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    /**
     * ユーザー名またはメールアドレスでユーザーを検索
     * @param username ユーザー名
     * @param email メールアドレス
     * @return ユーザー（存在しない場合は空）
     */
    @Transactional(readOnly = true)
    public Optional<User> findByUsernameOrEmail(String username, String email) {
        return userRepository.findByUsernameOrEmail(username, email);
    }
    
    /**
     * 全ユーザーを取得
     * @return 全ユーザーのリスト
     */
    @Transactional(readOnly = true)
    public List<User> findAllUsers() {
        return userRepository.findAll();
    }
    
    /**
     * IDでユーザーを検索
     * @param id ユーザーID
     * @return ユーザー（存在しない場合は空）
     */
    @Transactional(readOnly = true)
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
    /**
     * ユーザー情報を更新
     * @param user 更新するユーザー情報
     * @return 更新されたユーザー
     */
    public User updateUser(User user) {
        return userRepository.save(user);
    }
    
    /**
     * ユーザーを削除
     * @param id 削除するユーザーのID
     */
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    
    /**
     * ユーザー名が存在するかチェック
     * @param username ユーザー名
     * @return 存在する場合true
     */
    @Transactional(readOnly = true)
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }
    
    /**
     * メールアドレスが存在するかチェック
     * @param email メールアドレス
     * @return 存在する場合true
     */
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}
