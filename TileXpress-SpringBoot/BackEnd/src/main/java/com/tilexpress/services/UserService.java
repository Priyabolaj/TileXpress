package com.tilexpress.services;

import java.util.List;

import com.tilexpress.exceptions.UserException;
import com.tilexpress.model.Address;
import com.tilexpress.model.User;
import com.tilexpress.requests.UpdatePasswordRequest;

public interface UserService {

    public User findById(Long userId) throws UserException;

    public User findUserProfileByJwt(String jwt) throws UserException;

    public User updateUser(String jwt,User user) throws UserException;

    public  String updatePassword(String jwt, UpdatePasswordRequest updatePasswordRequest) throws UserException;

    public String addAddress(String jwt, Address address)throws UserException;

    public List<Address> getAddress(String jwt)throws UserException;

    public String removeAddress(String jwt,Long addressId)throws UserException;

    public String deleteUser(Long userId) throws UserException;
}
